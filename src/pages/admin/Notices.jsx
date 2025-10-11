import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Center
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sector: ''
  });
  const [deleteNoticeId, setDeleteNoticeId] = useState(null);
  
  const { user, isAdmin, userProfile } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  const toast = useToast();
  const cancelRef = React.useRef();

  const sectors = [
    'Geral',
    'Psicologia',
    'Administração',
    'Recepção',
    'Limpeza',
    'Manutenção'
  ];

  useEffect(() => {
    // Não fazer consultas ao banco para usuários demo
    if (user?.id === '00000000-0000-4000-8000-000000000001' || user?.id === '00000000-0000-4000-8000-000000000002') {
      // Dados mockados para demonstração
      const mockNotices = [
        {
          id: 1,
          title: 'Bem-vindos ao Sistema!',
          content: 'Este é um aviso de demonstração. O sistema está funcionando corretamente.',
          sector: 'Geral',
          author_id: user.id,
          created_at: new Date().toISOString(),
          users: { name: user?.user_metadata?.name || 'Demo User' }
        },
        {
          id: 2,
          title: 'Funcionalidades Disponíveis',
          content: 'Explore todas as funcionalidades do sistema: Chat, Agenda, Documentos e Enquetes.',
          sector: 'Informativo',
          author_id: user.id,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          users: { name: user?.user_metadata?.name || 'Demo User' }
        }
      ];
      setNotices(mockNotices);
      setLoading(false);
      return;
    }
    
    fetchNotices();
  }, [user]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Adicionar informação do autor atual se for o mesmo usuário
      const enrichedData = (data || []).map(notice => ({
        ...notice,
        users: {
          name: notice.author_id === user?.id 
            ? (user?.user_metadata?.name || user?.email?.split('@')[0] || 'Você')
            : 'Equipe Entre Afetos'
        }
      }));
      
      setNotices(enrichedData);
    } catch (error) {
      toast({
        title: 'Erro ao carregar avisos',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedNotice) {
        // Atualizar aviso existente
        const { error } = await supabase
          .from('notices')
          .update({
            title: formData.title,
            content: formData.content,
            sector: formData.sector
          })
          .eq('id', selectedNotice.id);

        if (error) throw error;

        toast({
          title: 'Aviso atualizado com sucesso!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Criar novo aviso
        const { error } = await supabase
          .from('notices')
          .insert([{
            title: formData.title,
            content: formData.content,
            sector: formData.sector,
            author_id: user.id
          }]);

        if (error) throw error;

        toast({
          title: 'Aviso criado com sucesso!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      handleCloseModal();
      fetchNotices();
    } catch (error) {
      toast({
        title: 'Erro ao salvar aviso',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      sector: notice.sector
    });
    onOpen();
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', deleteNoticeId);

      if (error) throw error;

      toast({
        title: 'Aviso excluído com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchNotices();
    } catch (error) {
      toast({
        title: 'Erro ao excluir aviso',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setDeleteNoticeId(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
    setFormData({
      title: '',
      content: '',
      sector: ''
    });
    onClose();
  };

  const openDeleteDialog = (noticeId) => {
    setDeleteNoticeId(noticeId);
    onDeleteOpen();
  };

  const getSectorColor = (sector) => {
    const colors = {
      'Geral': 'blue',
      'Psicologia': 'purple',
      'Administração': 'green',
      'Recepção': 'orange',
      'Limpeza': 'cyan',
      'Manutenção': 'red',
      'Informativo': 'teal'
    };
    return colors[sector] || 'gray';
  };

  const getSectorColorBorder = (sector) => {
    const colors = {
      'Geral': '#3182ce',
      'Psicologia': '#805ad5',
      'Administração': '#38a169',
      'Recepção': '#ed8936',
      'Limpeza': '#00b5d8',
      'Manutenção': '#e53e3e',
      'Informativo': '#319795'
    };
    return colors[sector] || '#718096';
  };

  const getSectorColorBorderHover = (sector) => {
    const colors = {
      'Geral': '#2c5aa0',
      'Psicologia': '#6b46c1',
      'Administração': '#2f855a',
      'Recepção': '#dd6b20',
      'Limpeza': '#0987a0',
      'Manutenção': '#c53030',
      'Informativo': '#2c7a7b'
    };
    return colors[sector] || '#4a5568';
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.700">
          Mural de Avisos
        </Heading>
        {userProfile?.role !== 'user' && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Novo Aviso
          </Button>
        )}
      </Flex>

      <VStack spacing={4} align="stretch">
        {notices.length === 0 ? (
          <Card>
            <CardBody>
              <Text textAlign="center" color="gray.500">
                Nenhum aviso encontrado. Crie o primeiro aviso!
              </Text>
            </CardBody>
          </Card>
        ) : (
          notices.map((notice) => (
            <Box
              key={notice.id}
              position="relative"
              bg="linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
              borderRadius="16px"
              border="3px solid"
              borderColor={getSectorColorBorder(notice.sector)}
              p={6}
              shadow="lg"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "xl",
                borderColor: getSectorColorBorderHover(notice.sector)
              }}
              _before={{
                content: '""',
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                bg: getSectorColorBorder(notice.sector),
                opacity: 0.3
              }}
              _after={{
                content: '""',
                position: 'absolute',
                bottom: '12px',
                right: '24px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                bg: getSectorColorBorder(notice.sector),
                opacity: 0.2
              }}
            >
              <VStack align="start" spacing={4} w="full">
                <Flex justify="space-between" align="flex-start" w="full">
                  <VStack align="start" spacing={2} flex={1}>
                    <Heading 
                      size="md" 
                      color="gray.700"
                      fontWeight="bold"
                    >
                      {notice.title}
                    </Heading>
                    <HStack spacing={3} flexWrap="wrap">
                      <Badge 
                        colorScheme={getSectorColor(notice.sector)}
                        variant="solid"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        {notice.sector}
                      </Badge>
                      <Text 
                        fontSize="xs" 
                        color="gray.500"
                        fontWeight="500"
                      >
                        Por: {notice.users?.name || 'Usuário desconhecido'}
                      </Text>
                      <Text 
                        fontSize="xs" 
                        color="gray.500"
                        fontWeight="500"
                      >
                        {new Date(notice.created_at).toLocaleDateString('pt-BR')}
                      </Text>
                    </HStack>
                  </VStack>
                  
                  {(isAdmin() || notice.author_id === user.id) && userProfile?.role !== 'user' && (
                    <HStack spacing={2}>
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        borderRadius="full"
                        onClick={() => handleEdit(notice)}
                        aria-label="Editar aviso"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        borderRadius="full"
                        onClick={() => openDeleteDialog(notice.id)}
                        aria-label="Excluir aviso"
                      />
                    </HStack>
                  )}
                </Flex>
                
                <Text 
                  color="gray.600" 
                  whiteSpace="pre-wrap"
                  lineHeight="1.6"
                  fontSize="sm"
                  bg="gray.50"
                  p={4}
                  borderRadius="12px"
                  border="1px solid"
                  borderColor="gray.200"
                  w="full"
                >
                  {notice.content}
                </Text>
              </VStack>
            </Box>
          ))
        )}
      </VStack>

      {/* Modal para criar/editar aviso */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {selectedNotice ? 'Editar Aviso' : 'Novo Aviso'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Digite o título do aviso"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Setor</FormLabel>
                  <Select
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    placeholder="Selecione o setor"
                  >
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Conteúdo</FormLabel>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Digite o conteúdo do aviso"
                    rows={6}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" colorScheme="blue">
                {selectedNotice ? 'Atualizar' : 'Criar'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Aviso
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir este aviso? Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Notices;