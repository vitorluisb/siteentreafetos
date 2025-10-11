import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  Tooltip,
  Flex,
  Spacer,
  InputGroup,
  InputLeftElement,
  Spinner,
  Center,
  Avatar
} from '@chakra-ui/react';
import { 
  FaEdit, 
  FaTrash, 
  FaUserPlus, 
  FaSearch,
  FaUserShield,
  FaUser,
  FaEnvelope,
  FaCalendar
} from 'react-icons/fa';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
    full_name: ''
  });
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { user, isAdmin } = useAuth();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  const cancelRef = React.useRef();

  // Carregar perfis de usuários via RPC Function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_user_profiles_for_admin');
      
      if (error) throw error;

      // Transformar dados para o formato esperado pelo frontend
      const usersWithEmail = (data || []).map(profile => ({
        id: profile.id,
        email: profile.email || 'email@não.informado',
        full_name: profile.full_name || '',
        display_name: profile.display_name || '',
        role: profile.role || 'user',
        avatar_url: profile.avatar_url || null,
        created_at: profile.created_at,
        last_sign_in_at: null, // Não temos esta informação
        email_confirmed_at: null, // Não temos esta informação
        active: profile.auth_exists || false // Status do Auth
      }));

      setUsers(usersWithEmail);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      setCreating(true);

      // Chamar Edge Function para criar usuário automaticamente
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Superfície mais detalhes do erro vindo da função edge
        const details = data?.details ? `: ${data.details}` : '';
        throw new Error((data?.error || 'Erro ao criar usuário') + details);
      }

      toast({
        title: '✅ Usuário criado com sucesso!',
        description: data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setFormData({ email: '', password: '', role: 'user', full_name: '' });
      onCreateClose();
      fetchUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: 'Erro ao criar usuário',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCreating(false);
    }
  };

  const handleEditUser = async () => {
    try {
      setUpdating(true);

      const { data, error } = await supabase.rpc('update_user_profile_simple', {
        user_id: selectedUser.id,
        user_email: formData.email,
        user_full_name: formData.full_name,
        user_role: formData.role
      });

      if (error) throw error;

      toast({
        title: 'Usuário atualizado com sucesso!',
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onEditClose();
      fetchUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setDeleting(true);
      // Usar Edge Function com service role para excluir tanto no Auth quanto no perfil
      const accessToken = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: userToDelete.id })
      });

      const result = await response.json();
      if (!response.ok) {
        const details = result?.details ? `: ${result.details}` : '';
        throw new Error((result?.error || 'Erro ao excluir usuário') + details);
      }

      toast({
        title: 'Usuário excluído com sucesso!',
        description: result?.message || 'Exclusão concluída.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onDeleteClose();
      fetchUsers(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '',
      role: user.role || 'user',
      full_name: user.full_name || ''
    });
    onEditOpen();
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    onDeleteOpen();
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'red', icon: <FaUserShield />, label: 'Admin' },
      user: { color: 'blue', icon: <FaUser />, label: 'Usuário' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    
    return (
      <Badge 
        colorScheme={config.color} 
        variant="subtle"
        display="flex"
        alignItems="center"
        gap={1}
      >
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Flex align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="bold">
              Gestão de Usuários
            </Text>
            <Text color="gray.600">
              Gerencie usuários do sistema
            </Text>
          </VStack>
          <Spacer />
          <Button
            leftIcon={<FaUserPlus />}
            colorScheme="blue"
            onClick={onCreateOpen}
          >
            Novo Usuário
          </Button>
        </Flex>

        <HStack spacing={4}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </HStack>

        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Usuário</Th>
                <Th>Email</Th>
                <Th>Função</Th>
                <Th>Status</Th>
                <Th>Criado em</Th>
                <Th>Último acesso</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={7} textAlign="center">
                    <Center py={8}>
                      <Spinner size="lg" color="blue.500" />
                    </Center>
                  </Td>
                </Tr>
              ) : filteredUsers.length === 0 ? (
                <Tr>
                  <Td colSpan={7} textAlign="center">
                    <Center py={8}>
                      <VStack spacing={2}>
                        <FaUser size={32} color="#CBD5E0" />
                        <Text color="gray.500">Nenhum usuário encontrado</Text>
                      </VStack>
                    </Center>
                  </Td>
                </Tr>
              ) : (
                filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar 
                          size="sm" 
                          name={user.full_name || user.email}
                          src={user.avatar_url}
                          bg="blue.500"
                        />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">
                            {user.full_name || 'Nome não informado'}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            ID: {user.id.substring(0, 8)}...
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack>
                        <FaEnvelope color="gray.400" />
                        <Text>{user.email}</Text>
                      </HStack>
                    </Td>
                    <Td>{getRoleBadge(user.role)}</Td>
                    <Td>
                      <Badge 
                        colorScheme={user.email_confirmed_at ? 'green' : 'yellow'}
                        variant="subtle"
                      >
                        {user.email_confirmed_at ? 'Confirmado' : 'Pendente'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack>
                        <FaCalendar color="gray.400" />
                        <Text fontSize="sm">
                          {formatDate(user.created_at)}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">
                        {formatDate(user.last_sign_in_at)}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label="Editar usuário">
                          <IconButton
                            icon={<FaEdit />}
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => openEditModal(user)}
                            isDisabled={false} // Permitir edição de todos os usuários
                          />
                        </Tooltip>
                        <Tooltip label="Excluir usuário">
                          <IconButton
                            icon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => openDeleteModal(user)}
                            isDisabled={false} // Permitir exclusão de todos os usuários
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>

      {/* Modal de Criação */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome Completo</FormLabel>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite o email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Digite a senha"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Função</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateClose}>
              Cancelar
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCreateUser}
              isLoading={creating}
              loadingText="Criando..."
              isDisabled={!formData.email || !formData.password || !formData.full_name}
            >
              Criar Usuário
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Edição */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome Completo</FormLabel>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  isReadOnly
                  bg="gray.50"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Função</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancelar
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleEditUser}
              isLoading={updating}
              loadingText="Atualizando..."
              isDisabled={!formData.full_name}
            >
              Salvar Alterações
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Usuário
            </AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza que deseja excluir o usuário{' '}
              <strong>{userToDelete?.full_name || userToDelete?.email}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteUser} ml={3} isLoading={deleting} loadingText="Excluindo...">
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Users;