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
  useColorModeValue
} from '@chakra-ui/react';
import { FaUsers, FaCircle } from 'react-icons/fa';
import { supabase } from "../../config/supabase";
import { useAuth } from '../../contexts/AuthContext';

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Função para buscar usuários online
  const fetchOnlineUsers = async () => {
    try {
      setError(null);
      
      // Primeiro, buscar usuários que estão online na tabela user_presence
      const { data: presenceData, error: presenceError } = await supabase
        .from('user_presence')
        .select('id, last_seen')
        .eq('is_online', true);

      if (presenceError) {
        setError('Erro ao carregar usuários online');
        return;
      }

      if (!presenceData || presenceData.length === 0) {
        setOnlineUsers([]);
        return;
      }

      // Buscar dados dos usuários que estão online
      const userIds = presenceData.map(p => p.id);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, display_name, role, avatar_url, created_at')
        .in('id', userIds);
      
      if (error) {
        setError('Erro ao carregar usuários online');
        return;
      }
      
      // Combinar dados dos usuários com dados de presença
      const transformedData = data?.map(user => {
        const presenceInfo = presenceData.find(p => p.id === user.id);
        return {
          id: user.id,
          full_name: user.full_name,
          display_name: user.display_name,
          role: user.role,
          avatar_url: user.avatar_url,
          is_online: true, // Todos estão online já que filtramos por is_online = true
          last_seen: presenceInfo?.last_seen || user.created_at
        };
      }) || [];
      
      setOnlineUsers(transformedData);
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar usuários online');
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar presença do usuário atual
  const updateUserPresence = async (isOnline) => {
    if (!user?.id) return;

    try {
      
      // Usar upsert direto na tabela user_presence
      const { data, error } = await supabase
        .from('user_presence')
        .upsert({
          id: user.id,
          is_online: isOnline,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        // Silenciosamente falha - não é crítico
      }
    } catch (err) {
      // Silenciosamente falha - não é crítico
    }
  };

  // Configurar presença e subscriptions
  useEffect(() => {
    if (!user?.id) return;

    // Marcar usuário como online ao carregar
    updateUserPresence(true);

    // Buscar usuários online inicialmente
    fetchOnlineUsers();

    // Configurar subscription para mudanças em tempo real
    const subscription = supabase
      .channel('user_presence_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        () => {
          // Recarregar lista quando houver mudanças
          fetchOnlineUsers();
        }
      )
      .subscribe();

    // Atualizar presença periodicamente (heartbeat)
    const heartbeatInterval = setInterval(() => {
      updateUserPresence(true);
    }, 60000); // A cada 1 minuto

    // Cleanup ao desmontar componente
    return () => {
      updateUserPresence(false);
      clearInterval(heartbeatInterval);
      subscription.unsubscribe();
    };
  }, [user?.id]);

  // Marcar como offline ao sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateUserPresence(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateUserPresence(false);
      } else if (document.visibilityState === 'visible') {
        updateUserPresence(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'psicologo': return 'blue';
      default: return 'green';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'psicologo': return 'Psicólogo';
      default: return 'Usuário';
    }
  };

  if (loading) {
    return (
      <Box
        bg={bgColor}
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        shadow="sm"
      >
        <VStack spacing={4}>
          <HStack spacing={3}>
            <FaUsers size={20} color="var(--chakra-colors-blue-500)" />
            <Text fontSize="lg" fontWeight="bold">
              Usuários Online
            </Text>
          </HStack>
          <Spinner size="md" color="blue.500" />
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        bg={bgColor}
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        shadow="sm"
      >
        <VStack spacing={4}>
          <HStack spacing={3}>
            <FaUsers size={20} color="var(--chakra-colors-blue-500)" />
            <Text fontSize="lg" fontWeight="bold">
              Usuários Online
            </Text>
          </HStack>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      shadow="sm"
      h="fit-content"
    >
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            <FaUsers size={20} color="var(--chakra-colors-blue-500)" />
            <Text fontSize="lg" fontWeight="bold">
              Usuários Online
            </Text>
          </HStack>
          <Badge
            colorScheme="green"
            variant="solid"
            borderRadius="full"
            px={3}
            py={1}
            fontSize="sm"
          >
            {onlineUsers.length}
          </Badge>
        </Flex>

        <Divider />

        {/* Lista de usuários online */}
        {onlineUsers.length === 0 ? (
          <Text color={textColor} textAlign="center" py={4}>
            Nenhum usuário online no momento
          </Text>
        ) : (
          <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
            {onlineUsers.map((user) => (
              <HStack key={user.id} spacing={3} p={2} borderRadius="md" _hover={{ bg: 'gray.50' }}>
                <Box position="relative">
                  <Avatar
                    size="sm"
                    name={user.display_name || user.full_name}
                    src={user.avatar_url}
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    right={0}
                    w={3}
                    h={3}
                    bg="green.400"
                    borderRadius="full"
                    border="2px"
                    borderColor={bgColor}
                  />
                </Box>
                
                <VStack spacing={0} align="start" flex={1}>
                  <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                    {user.display_name || user.full_name || 'Usuário'}
                  </Text>
                  <HStack spacing={2}>
                    <Badge
                      size="xs"
                      colorScheme={getRoleColor(user.role)}
                      variant="subtle"
                    >
                      {getRoleLabel(user.role)}
                    </Badge>
                    <HStack spacing={1}>
                      <FaCircle size={6} color="var(--chakra-colors-green-400)" />
                      <Text fontSize="xs" color={textColor}>
                        Online
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default OnlineUsers;