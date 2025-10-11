import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Divider,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody
} from '@chakra-ui/react';
import { FaUsers, FaCircle } from 'react-icons/fa';
import { supabase } from "../../config/supabase";
import { useAuth } from '../../contexts/AuthContext';

const OnlineUsersTemp = ({ compact = false }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Função temporária para buscar usuários (sem RPC)
  const fetchOnlineUsers = async () => {
    try {
      setError(null);
      
      if (!user?.id) {
        setOnlineUsers([]);
        return;
      }

      // Buscar apenas o perfil do usuário atual logado
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, display_name, role, avatar_url, created_at')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        setError('Erro ao carregar perfil do usuário');
        return;
      }

      // Mostrar apenas o usuário atual como online
      const currentUserOnline = data ? [{
        ...data,
        is_online: true, // Usuário atual está sempre online
        last_seen: new Date()
      }] : [];

      setOnlineUsers(currentUserOnline);
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar presença do usuário atual (temporário)
  const updateUserPresence = async (isOnline) => {
    if (!user?.id) return;

    try {
      // Tentar inserir/atualizar na tabela user_presence diretamente
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          id: user.id,
          is_online: isOnline,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.log('Erro ao atualizar presença (esperado se tabela não existir):', error);
      }
    } catch (err) {
      console.log('Erro ao atualizar presença:', err);
    }
  };

  useEffect(() => {
    fetchOnlineUsers();
    
    // Marcar usuário como online
    updateUserPresence(true);

    // Atualizar lista a cada 30 segundos
    const interval = setInterval(fetchOnlineUsers, 30000);

    // Cleanup: marcar como offline ao sair
    return () => {
      clearInterval(interval);
      updateUserPresence(false);
    };
  }, [user]);

  if (loading) {
    return compact ? (
      <Flex justify="center" align="center" h="40px">
        <Spinner size="sm" color="pink.500" />
      </Flex>
    ) : (
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardHeader pb={2}>
          <HStack spacing={2}>
            <FaUsers color="#E8B4B8" />
            <Text fontSize="lg" fontWeight="semibold">
              Usuários Online
            </Text>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <Flex justify="center" align="center" h="100px">
            <Spinner color="pink.500" />
          </Flex>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return compact ? (
      <Text fontSize="xs" color="orange.500" textAlign="center">
        Sistema em configuração
      </Text>
    ) : (
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardHeader pb={2}>
          <HStack spacing={2}>
            <FaUsers color="#E8B4B8" />
            <Text fontSize="lg" fontWeight="semibold">
              Usuários Online
            </Text>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <Alert status="warning" size="sm">
            <AlertIcon />
            <Text fontSize="sm">
              Sistema de presença em configuração
            </Text>
          </Alert>
        </CardBody>
      </Card>
    );
  }

  if (compact) {
    return (
      <VStack spacing={1} align="stretch">
        {onlineUsers.length === 0 ? (
          <Text fontSize="xs" color={textColor} textAlign="center">
            Nenhum usuário online
          </Text>
        ) : (
          onlineUsers.map((user) => (
            <HStack key={user.id} spacing={2} p={1}>
              <Avatar
                size="xs"
                name={user.display_name || user.full_name}
                src={user.avatar_url}
              />
              <VStack spacing={0} align="start" flex={1}>
                <Text fontSize="xs" fontWeight="medium" noOfLines={1}>
                  {user.display_name || user.full_name || 'Usuário'}
                </Text>
                <HStack spacing={1}>
                  <FaCircle size={6} color="#E8B4B8" />
                  <Text fontSize="2xs" color={textColor}>
                    {user.role || 'user'}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          ))
        )}
      </VStack>
    );
  }

  return (
    <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
      <CardHeader pb={2}>
        <HStack spacing={2} justify="space-between">
          <HStack spacing={2}>
            <FaUsers color="#E8B4B8" />
            <Text fontSize="lg" fontWeight="semibold">
              Usuários Online
            </Text>
          </HStack>
          <Badge colorScheme="pink" variant="subtle">
            {onlineUsers.length}
          </Badge>
        </HStack>
      </CardHeader>
      
      <CardBody pt={0}>
        {onlineUsers.length === 0 ? (
          <Text fontSize="sm" color={textColor} textAlign="center" py={4}>
            Nenhum usuário online no momento
          </Text>
        ) : (
          <VStack spacing={3} align="stretch">
            {onlineUsers.map((user, index) => (
              <Box key={user.id}>
                <HStack spacing={3}>
                  <Avatar
                    size="sm"
                    name={user.display_name || user.full_name}
                    src={user.avatar_url}
                  />
                  <VStack spacing={0} align="start" flex={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      {user.display_name || user.full_name || 'Usuário'}
                    </Text>
                    <HStack spacing={1}>
                      <FaCircle size={8} color="#E8B4B8" />
                      <Text fontSize="xs" color={textColor}>
                        {user.role || 'user'}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
                {index < onlineUsers.length - 1 && <Divider />}
              </Box>
            ))}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};

export default OnlineUsersTemp;