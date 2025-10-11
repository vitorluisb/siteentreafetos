import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  Text,
  useToast,
  Divider,
  Badge,
  HStack,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Center
} from '@chakra-ui/react';
import { FaCamera, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

const Profile = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    display_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.user_metadata?.name || '',
        display_name: user?.user_metadata?.display_name || user?.user_metadata?.name || ''
      });
      // Carregar avatar priorizando o valor de user_profiles
      setAvatarUrl(userProfile?.avatar_url || user?.user_metadata?.avatar_url || null);
    }
  }, [user, userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'O nome completo é obrigatório',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await updateProfile({
        name: formData.name.trim(),
        display_name: formData.display_name.trim() || formData.name.trim()
      });

      if (error) throw error;

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Arquivo inválido',
        description: 'Por favor, selecione uma imagem (JPG, PNG, etc.)',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'A imagem deve ter no máximo 2MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setUploadingAvatar(true);

      // Criar nome único para o arquivo (evita cache com timestamp)
      const fileExt = (file.name.split('.').pop() || 'png').toLowerCase();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      // Deletar avatar antigo se existir
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar PRIMEIRO a tabela user_profiles (coluna correta é 'id')
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (profileError) {
        console.error('Erro ao atualizar user_profiles:', profileError);
        throw new Error(`Erro ao atualizar perfil: ${profileError.message}`);
      }

      // Tentar atualizar user_metadata (opcional, pode falhar se não houver coluna)
      try {
        await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        });
      } catch (metaError) {
        console.warn('Não foi possível atualizar user_metadata:', metaError);
        // Não falhar se isso não funcionar
      }

      setAvatarUrl(publicUrl);

      toast({
        title: 'Foto atualizada!',
        description: 'Sua foto de perfil foi atualizada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Recarregar a página para atualizar todos os avatares
      setTimeout(() => window.location.reload(), 1500);

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro ao fazer upload',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;

    try {
      setUploadingAvatar(true);

      // Deletar do storage
      const path = avatarUrl.split('/').slice(-2).join('/');
      await supabase.storage.from('avatars').remove([path]);

      // Remover do user_profiles (coluna correta é 'id')
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (profileError) {
        console.error('Erro ao atualizar user_profiles:', profileError);
        throw profileError;
      }

      // Tentar remover do user_metadata (opcional)
      try {
        await supabase.auth.updateUser({
          data: { avatar_url: null }
        });
      } catch (metaError) {
        console.warn('Não foi possível atualizar user_metadata:', metaError);
      }

      setAvatarUrl(null);

      toast({
        title: 'Foto removida',
        description: 'Sua foto de perfil foi removida',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      setTimeout(() => window.location.reload(), 1500);

    } catch (error) {
      console.error('Erro ao remover avatar:', error);
      toast({
        title: 'Erro ao remover foto',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getRoleBadge = () => {
    const roleLabels = {
      'admin': { label: 'Administrador', color: 'red' },
      'psicologo': { label: 'Psicólogo', color: 'purple' },
      'equipe': { label: 'Equipe', color: 'blue' },
      'user': { label: 'Usuário', color: 'green' }
    };
    const role = userProfile?.role || 'user';
    const roleInfo = roleLabels[role] || roleLabels['user'];
    return <Badge colorScheme={roleInfo.color}>{roleInfo.label}</Badge>;
  };

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Heading size="lg" mb={6} color="gray.700">
        Meu Perfil
      </Heading>

      <Card shadow="lg">
        <CardHeader bg="blue.50">
          <Flex align="center" gap={4}>
            <Box position="relative">
              {uploadingAvatar ? (
                <Center w="96px" h="96px" borderRadius="full" bg="gray.200">
                  <Spinner size="lg" color="blue.500" />
                </Center>
              ) : (
                <Avatar 
                  size="xl" 
                  name={formData.display_name || formData.name || user?.email}
                  src={avatarUrl}
                  bg="blue.500"
                />
              )}
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                display="none"
              />
              <IconButton
                icon={<Icon as={FaCamera} />}
                size="sm"
                colorScheme="blue"
                borderRadius="full"
                position="absolute"
                bottom="0"
                right="0"
                onClick={() => fileInputRef.current?.click()}
                isDisabled={uploadingAvatar}
                aria-label="Alterar foto"
                title="Alterar foto de perfil"
              />
              {avatarUrl && (
                <IconButton
                  icon={<Icon as={FaTrash} />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  borderRadius="full"
                  position="absolute"
                  top="-2"
                  right="-2"
                  onClick={handleRemoveAvatar}
                  isDisabled={uploadingAvatar}
                  aria-label="Remover foto"
                  title="Remover foto de perfil"
                />
              )}
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="md" color="gray.700">
                {formData.display_name || formData.name || 'Sem nome'}
              </Heading>
              <Text color="gray.600" fontSize="sm">
                {user?.email}
              </Text>
              {getRoleBadge()}
              <Text fontSize="xs" color="gray.500" mt={1}>
                Clique na câmera para alterar sua foto
              </Text>
            </VStack>
          </Flex>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Heading size="sm" color="gray.600">
                Informações Pessoais
              </Heading>

              <FormControl isRequired>
                <FormLabel>Nome Completo</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite seu nome completo"
                  size="lg"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Seu nome completo será usado em documentos e assinaturas
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Como quer ser chamado(a)?</FormLabel>
                <Input
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="Ex: João, Maria, Dr. Silva..."
                  size="lg"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Este nome aparecerá no chat, avisos e em todo o sistema
                </Text>
              </FormControl>

              <Divider />

              <Heading size="sm" color="gray.600">
                Informações da Conta
              </Heading>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  value={user?.email || ''}
                  isReadOnly
                  isDisabled
                  bg="gray.100"
                  size="lg"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  O email não pode ser alterado
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Tipo de Conta</FormLabel>
                <HStack>
                  {getRoleBadge()}
                  <Text fontSize="sm" color="gray.600">
                    {userProfile?.role === 'admin' && '- Acesso total ao sistema'}
                    {userProfile?.role === 'psicologo' && '- Pode gerenciar avisos e enquetes'}
                    {userProfile?.role === 'equipe' && '- Acesso à equipe'}
                    {userProfile?.role === 'user' && '- Acesso básico'}
                  </Text>
                </HStack>
              </FormControl>

              <Divider />

              <HStack justify="flex-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFormData({
                      name: user?.user_metadata?.name || '',
                      display_name: user?.user_metadata?.display_name || user?.user_metadata?.name || ''
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  loadingText="Salvando..."
                  size="lg"
                >
                  Salvar Alterações
                </Button>
              </HStack>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Profile;

