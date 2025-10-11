import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  Flex,
  Badge,
  IconButton,
  useToast,
  useDisclosure,
  Spinner,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Grid,
  Wrap,
  WrapItem,
  Collapse,
  Divider
} from '@chakra-ui/react';
import { ChatIcon, AttachmentIcon, DeleteIcon, ArrowForwardIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import OnlineUsers from '../../components/admin/OnlineUsers';
import FileUpload from '../../components/admin/FileUpload';
import FileMessage from '../../components/admin/FileMessage';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // Ref para o input de mensagem
  const processingMessageIds = useRef(new Set()); // Prevenir duplicatas
  const { user, userProfile, isAdmin, getDisplayName } = useAuth();
  const { isOpen: isClearOpen, onOpen: onClearOpen, onClose: onClearClose } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();

  // Emojis populares para o chat
  const popularEmojis = [
    '😊', '😂', '😍', '🥰', '😘', '😉', '😎', '🤔', '😮', '😢',
    '😭', '😡', '🤯', '😱', '😴', '🤤', '😋', '🤢', '🤮', '🤧',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '👏', '🙌', '👐',
    '❤️', '💕', '💖', '💗', '💘', '💙', '💚', '💛', '🧡', '💜',
    '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '⭐', '🌟', '✨', '💫',
    '🔥', '💯', '✅', '❌', '⚠️', '🚨', '💡', '🔔', '📢', '📣'
  ];

  useEffect(() => {
    fetchMessages();
    const unsubscribe = subscribeToMessages();

    return () => {
      // Cleanup subscription
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      // Construir fallback de avatar para mensagens sem sender_avatar_url
      let avatarMap = {};
      const missingIds = Array.from(new Set((data || [])
        .filter(m => !m.sender_avatar_url)
        .map(m => m.sender_id)));

      if (missingIds.length) {
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, avatar_url')
          .in('id', missingIds);

        if (!profileError && profiles) {
          avatarMap = profiles.reduce((acc, p) => {
            acc[p.id] = p.avatar_url;
            return acc;
          }, {});
        }
      }

      setMessages((data || []).map(msg => ({
        ...msg,
        sender_avatar_url: msg.sender_avatar_url || avatarMap[msg.sender_id] || null,
        users: {
          name: msg.sender_name || (msg.sender_id === user?.id ? getDisplayName() : 'Equipe'),
          role: msg.sender_role || (msg.sender_id === user?.id ? (user?.user_metadata?.role || 'user') : 'user')
        }
      })));
    } catch (error) {
      toast({
        title: 'Erro ao carregar mensagens',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    // Não conectar ao WebSocket para usuário demo
    if (user?.id === '00000000-0000-4000-8000-000000000001') {
      console.log('⚠️ Usuário demo - WebSocket desativado');
      return null;
    }
    
    console.log('🔌 Conectando ao Realtime...');
    console.log('👤 User ID:', user?.id);
    
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          console.log('🔔 Realtime DISPAROU! Payload:', payload);
          // Buscar dados completos da mensagem
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            console.log('📡 Realtime recebeu mensagem:', data.id, 'De:', data.sender_id);
            
            // IGNORAR mensagens enviadas por você mesmo
            if (data.sender_id === user?.id) {
              console.log('⏭️ Pulando - mensagem enviada por você');
              return;
            }
            
            // Fallback para avatar do remetente se não estiver salvo na mensagem
            if (!data.sender_avatar_url) {
              const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('avatar_url')
                .eq('id', data.sender_id)
                .single();

              if (!profileError && profile) {
                data.sender_avatar_url = profile.avatar_url || null;
              }
            }

            // Verificar se já processamos esta mensagem
            if (processingMessageIds.current.has(data.id)) {
              console.log('⏭️ Mensagem já processada (Set)');
              return;
            }
            
            // Marcar como processada
            processingMessageIds.current.add(data.id);
            
            const enrichedMessage = {
              ...data,
              users: {
                name: data.sender_name || 'Equipe',
                role: data.sender_role || 'user'
              }
            };
            
            // Evitar duplicatas - só adicionar se a mensagem não existir
            setMessages(prev => {
              const messageExists = prev.some(msg => msg.id === data.id);
              console.log('🔍 Mensagem já existe no estado?', messageExists);
              
              if (messageExists) {
                console.log('⏭️ Pulando - mensagem duplicada');
                return prev;
              }
              
              console.log('➕ Adicionando mensagem do Realtime');
              return [...prev, enrichedMessage];
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Status do Realtime:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime CONECTADO com sucesso!');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erro ao conectar Realtime');
        } else if (status === 'TIMED_OUT') {
          console.error('⏱️ Realtime timeout');
        }
      });

    return () => {
      console.log('🔌 Desconectando Realtime...');
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    // Para usuários demo, simular envio de mensagem
    if (user?.id === '00000000-0000-4000-8000-000000000001' || user?.id === '00000000-0000-4000-8000-000000000002') {
      setSending(true);
      
      // Simular delay de envio
      setTimeout(() => {
        const demoMessage = {
          id: Date.now(),
          content: newMessage.trim(),
          sender_id: user.id,
          created_at: new Date().toISOString(),
          users: { name: getDisplayName(), role: user?.user_metadata?.role || 'user' }
        };
        
        setMessages(prev => [...prev, demoMessage]);
        setNewMessage('');
        setSending(false);
        
        toast({
          title: 'Mensagem enviada (modo demo)',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Manter o foco no input após enviar
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }, 500);
      
      return;
    }

    const messageContent = newMessage.trim();
    
    console.log('💬 Enviando mensagem:', messageContent);
    console.log('👤 Usuário:', user?.email);

    try {
      setSending(true);
      setNewMessage('');
      
      // Enviar ao servidor PRIMEIRO
      console.log('📤 Enviando ao servidor...');
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content: messageContent,
          sender_id: user.id,
          sender_name: getDisplayName(),
          sender_role: user?.user_metadata?.role || 'user',
          sender_avatar_url: userProfile?.avatar_url || null
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Mensagem salva no banco:', data);

      // Verificar se já processamos esta mensagem
      if (processingMessageIds.current.has(data.id)) {
        console.log('⏭️ Mensagem já adicionada, pulando...');
        return;
      }

      // Marcar como processada
      processingMessageIds.current.add(data.id);
      console.log('✅ ID adicionado ao Set:', data.id);

      // Adicionar mensagem COM O ID REAL do banco (já tem sender_name/sender_role)
      console.log('➕ Adicionando mensagem ao estado...');
      const enrichedMessage = {
        ...data,
        users: {
          name: data.sender_name || getDisplayName(),
          role: data.sender_role || user?.user_metadata?.role || 'user'
        }
      };
      
      setMessages(prev => {
        console.log('🔄 setMessages callback executado');
        console.log('📋 Estado atual tem', prev.length, 'mensagens');
        console.log('🆕 Tentando adicionar ID:', data.id);
        
        // Dupla verificação: não adicionar se já existe
        const exists = prev.some(msg => msg.id === data.id);
        console.log('🔍 Já existe no estado?', exists);
        
        if (exists) {
          console.log('⏭️ Mensagem já existe no estado, retornando prev');
          return prev;
        }
        
        const newMessages = [...prev, enrichedMessage];
        console.log('📊 Total de mensagens:', newMessages.length);
        console.log('✅ Retornando novo array com', newMessages.length, 'mensagens');
        return newMessages;
      });
      
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSending(false);
      // Manter o foco no input após enviar
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleClearChat = async () => {
    try {
      setClearing(true);
      
      // Deletar todas as mensagens do banco
      const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta tudo (condição sempre verdadeira)

      if (error) throw error;

      // Limpar estado local
      setMessages([]);
      processingMessageIds.current.clear();

      toast({
        title: 'Chat limpo com sucesso!',
        description: 'Todas as mensagens foram removidas',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClearClose();
    } catch (error) {
      toast({
        title: 'Erro ao limpar chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setClearing(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'red',
      'user': 'blue'
    };
    return colors[role] || 'gray';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'admin': 'Admin',
      'user': 'Usuário'
    };
    return labels[role] || 'Usuário';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  // Função para adicionar emoji à mensagem
  const addEmojiToMessage = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };

  // Função para lidar com upload de arquivos
  const handleFileUpload = async (uploadedFiles) => {
    try {
      setSending(true);

      // Criar mensagem com arquivos
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content: `📎 ${uploadedFiles.length} arquivo${uploadedFiles.length > 1 ? 's' : ''} compartilhado${uploadedFiles.length > 1 ? 's' : ''}`,
          sender_id: user.id,
          sender_name: getDisplayName(),
          sender_role: user?.user_metadata?.role || 'user',
          sender_avatar_url: userProfile?.avatar_url || null,
          files: uploadedFiles,
          message_type: 'file'
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Mensagem com arquivos salva:', data);

      // Verificar se já processamos esta mensagem
      if (processingMessageIds.current.has(data.id)) {
        console.log('⏭️ Mensagem já adicionada, pulando...');
        return;
      }

      // Marcar como processada
      processingMessageIds.current.add(data.id);

      // Adicionar mensagem ao estado
      const enrichedMessage = {
        ...data,
        users: {
          name: data.sender_name || getDisplayName(),
          role: data.sender_role || user?.user_metadata?.role || 'user'
        }
      };
      
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === data.id);
        if (exists) return prev;
        
        const newMessages = [...prev, enrichedMessage];
        return newMessages;
      });
      
      setTimeout(scrollToBottom, 100);

      toast({
        title: 'Arquivos compartilhados com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('❌ Erro ao compartilhar arquivos:', error);
      
      toast({
        title: 'Erro ao compartilhar arquivos',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box h="calc(100vh - 80px)" display="flex" flexDirection="column" p={3}>
      {/* Header */}
      <Flex 
        align="center" 
        justify="space-between" 
        mb={2}
        bg="linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)"
        p={4}
        borderRadius="20px"
        shadow="lg"
        border="3px solid"
        borderColor="purple.400"
        _hover={{ 
          shadow: 'xl', 
          borderColor: 'purple.500',
          transition: 'all 0.3s ease'
        }}
        transition="all .3s"
        position="relative"
        overflow="hidden"
      >
        {/* Elementos decorativos */}
        <Box
          position="absolute"
          top={2}
          right={4}
          opacity={0.1}
        >
          <HStack spacing={1}>
            <Box w={2} h={2} bg="purple.400" borderRadius="full" />
            <Box w={2} h={2} bg="purple.300" borderRadius="full" />
            <Box w={2} h={2} bg="purple.200" borderRadius="full" />
          </HStack>
        </Box>

        <Flex align="center">
          <Box 
            p={3} 
            bg="linear-gradient(135deg, #F3E8FF 0%, #DDD6FE 100%)" 
            borderRadius="full"
            border="2px solid"
            borderColor="purple.300"
            mr={3}
          >
            <ChatIcon boxSize={6} color="purple.600" />
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Chat Interno
            </Text>
            <Text fontSize="sm" color="gray.600">
              {messages.length} {messages.length === 1 ? 'mensagem' : 'mensagens'}
            </Text>
          </Box>
        </Flex>
        
        <Flex align="center" gap={2}>
          {/* Botão para mostrar/ocultar usuários online */}
          <Tooltip label={showOnlineUsers ? "Ocultar usuários online" : "Mostrar usuários online"} placement="left">
            <IconButton
              icon={showOnlineUsers ? <ViewOffIcon /> : <ViewIcon />}
              colorScheme="blue"
              variant="ghost"
              size="md"
              onClick={() => setShowOnlineUsers(!showOnlineUsers)}
              aria-label={showOnlineUsers ? "Ocultar usuários online" : "Mostrar usuários online"}
              _hover={{ bg: 'blue.50' }}
            />
          </Tooltip>
          
          {/* Botão de Limpar Chat - Apenas para Admin */}
          {isAdmin() && messages.length > 0 && (
            <Tooltip label="Limpar todo o chat (Admin)" placement="left">
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="ghost"
                size="md"
                onClick={onClearOpen}
                aria-label="Limpar chat"
                _hover={{ bg: 'red.50' }}
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>

      {/* Usuários Online - Aparece/Desaparece com animação */}
      <Collapse in={showOnlineUsers} animateOpacity>
        <Box
          bg="white"
          borderRadius="md"
          shadow="sm"
          border="1px"
          borderColor="gray.100"
          mb={2}
          p={2}
          maxH="120px"
          overflowY="auto"
        >
          <Flex align="center" mb={1}>
            <Box
              bg="linear-gradient(135deg, #f4f1eb 0%, #e8ddd4 100%)"
              p={0.5}
              borderRadius="sm"
              mr={1.5}
            >
              <ViewIcon color="#8b7355" boxSize={2.5} />
            </Box>
            <Text fontSize="xs" fontWeight="semibold" color="gray.700">
              Online
            </Text>
          </Flex>
          <Box 
            css={{
              '&::-webkit-scrollbar': {
                width: '3px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#CBD5E0',
                borderRadius: '2px',
              },
            }}
          >
            <OnlineUsers compact={true} />
          </Box>
        </Box>
      </Collapse>

      {/* Messages Container */}
      <Box 
        flex="1" 
        overflowY="auto" 
        borderRadius="lg" 
        p={3}
        bg="linear-gradient(to bottom, #f8fafc, #f1f5f9)"
        shadow="inner"
        position="relative"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#A0AEC0',
          },
        }}
      >
        <VStack spacing={2} align="stretch">
          {messages.length === 0 ? (
            <Center h="200px" flexDirection="column">
              <Box
                bg="gray.100"
                p={4}
                borderRadius="full"
                mb={3}
              >
                <ChatIcon boxSize={8} color="gray.400" />
              </Box>
              <Text color="gray.500" fontWeight="medium">
                Nenhuma mensagem ainda
              </Text>
              <Text color="gray.400" fontSize="sm">
                Seja o primeiro a enviar uma mensagem!
              </Text>
            </Center>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user.id;
              const showDivider = index === 0 || 
                new Date(messages[index - 1].created_at).toDateString() !== 
                new Date(message.created_at).toDateString();

              return (
                <React.Fragment key={message.id}>
                  {showDivider && (
                    <Flex justify="center" my={2}>
                      <Badge
                        colorScheme="gray"
                        variant="subtle"
                        px={3}
                        py={0.5}
                        borderRadius="full"
                        fontSize="2xs"
                        fontWeight="medium"
                      >
                        {new Date(message.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </Badge>
                    </Flex>
                  )}
                  
                  <Flex 
                    justify={isOwnMessage ? 'flex-end' : 'flex-start'}
                    align="flex-end"
                    mb={1}
                  >
                    {!isOwnMessage && (
                      <Avatar 
                        size="sm" 
                        name={message.users?.name || 'Usuário'}
                        src={message.sender_avatar_url}
                        mr={2}
                        bg={`${getRoleColor(message.users?.role)}.500`}
                        color="white"
                        border="1px"
                        borderColor="white"
                        shadow="sm"
                      />
                    )}
                    
                    <Box maxW="75%">
                      {!isOwnMessage && (
                        <Flex mb={0.5} ml={1} align="center" gap={1.5}>
                          <Text fontSize="2xs" fontWeight="semibold" color="gray.600">
                            {message.users?.name || 'Usuário desconhecido'}
                          </Text>
                          <Badge 
                            size="xs" 
                            colorScheme={getRoleColor(message.users?.role)}
                            variant="subtle"
                            borderRadius="full"
                            px={1.5}
                            fontSize="2xs"
                          >
                            {getRoleLabel(message.users?.role)}
                          </Badge>
                        </Flex>
                      )}
                      
                      <Box 
                        bg="linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)"
                        color="gray.800"
                        px={4}
                        py={3}
                        borderRadius="20px"
                        shadow="lg"
                        position="relative"
                        border="3px solid"
                        borderColor={isOwnMessage 
                          ? (message.users?.role === 'admin' ? 'red.400' : 'blue.400')
                          : (message.users?.role === 'admin' ? 'red.400' : 'green.400')
                        }
                        transition="all 0.3s"
                        _hover={{
                          shadow: 'xl',
                          transform: 'translateY(-2px)',
                          borderColor: isOwnMessage 
                            ? (message.users?.role === 'admin' ? 'red.500' : 'blue.500')
                            : (message.users?.role === 'admin' ? 'red.500' : 'green.500')
                        }}
                        overflow="hidden"
                      >
                        {/* Elementos decorativos */}
                        <Box
                          position="absolute"
                          bottom={2}
                          right={3}
                          opacity={0.1}
                        >
                          <HStack spacing={1}>
                            <Box w={1.5} h={1.5} bg={isOwnMessage 
                              ? (message.users?.role === 'admin' ? 'red.400' : 'blue.400')
                              : (message.users?.role === 'admin' ? 'red.400' : 'green.400')
                            } borderRadius="full" />
                            <Box w={1.5} h={1.5} bg={isOwnMessage 
                              ? (message.users?.role === 'admin' ? 'red.300' : 'blue.300')
                              : (message.users?.role === 'admin' ? 'red.300' : 'green.300')
                            } borderRadius="full" />
                          </HStack>
                        </Box>
                        {/* Conteúdo da mensagem */}
                        {message.content && (
                          <Text 
                            fontSize="sm" 
                            whiteSpace="pre-wrap" 
                            lineHeight="1.4"
                            fontWeight="500"
                            letterSpacing="0.1px"
                            mb={message.files ? 2 : 0}
                          >
                            {message.content}
                          </Text>
                        )}

                        {/* Arquivos compartilhados */}
                        {message.files && message.files.length > 0 && (
                          <Box mt={message.content ? 2 : 0}>
                            <FileMessage 
                              files={message.files} 
                              isOwnMessage={isOwnMessage}
                            />
                          </Box>
                        )}
                        
                        <Text 
                          fontSize="2xs" 
                          opacity={0.6} 
                          mt={1}
                          textAlign="right"
                          fontWeight="medium"
                          letterSpacing="0.2px"
                        >
                          {formatTime(message.created_at)}
                        </Text>
                      </Box>
                    </Box>

                    {isOwnMessage && (
                      <Avatar 
                        size="sm" 
                        name={user.name || 'Você'}
                        src={userProfile?.avatar_url || undefined}
                        ml={2}
                        bg="linear-gradient(135deg, #f4f1eb 0%, #e8ddd4 100%)"
                        color="#8b7355"
                        border="1px"
                        borderColor="white"
                        shadow="sm"
                      />
                    )}
                  </Flex>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Message Input */}
      <Box mt={2}>
        <form onSubmit={sendMessage}>
          <Flex 
            bg="linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)" 
            p={3} 
            borderRadius="20px" 
            shadow="lg"
            border="3px solid"
            borderColor="teal.400"
            align="center"
            gap={2}
            position="relative"
            overflow="hidden"
            _hover={{
              shadow: 'xl',
              borderColor: 'teal.500',
              transition: 'all 0.3s ease'
            }}
            transition="all .3s"
          >
            {/* Elementos decorativos */}
            <Box
              position="absolute"
              top={2}
              left={4}
              opacity={0.1}
            >
              <HStack spacing={1}>
                <Box w={1.5} h={1.5} bg="teal.400" borderRadius="full" />
                <Box w={1.5} h={1.5} bg="teal.300" borderRadius="full" />
              </HStack>
            </Box>
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              bg="transparent"
              border="none"
              _focus={{ border: 'none', boxShadow: 'none' }}
              disabled={sending}
              fontSize="sm"
              px={3}
              autoFocus
            />
            <Popover placement="top">
              <PopoverTrigger>
                <IconButton
                  icon={<Text fontSize="md">😊</Text>}
                  variant="ghost"
                  colorScheme="gray"
                  size="sm"
                  borderRadius="full"
                  _hover={{ bg: 'gray.100' }}
                  aria-label="Adicionar emoji"
                  title="Escolher emoji"
                />
              </PopoverTrigger>
              <PopoverContent w="300px" p={3}>
                <PopoverBody>
                  <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.600">
                    Escolha um emoji:
                  </Text>
                  <Wrap spacing={2}>
                    {popularEmojis.map((emoji, index) => (
                      <WrapItem key={index}>
                        <IconButton
                          icon={<Text fontSize="lg">{emoji}</Text>}
                          size="sm"
                          variant="ghost"
                          borderRadius="md"
                          _hover={{ bg: 'gray.100', transform: 'scale(1.1)' }}
                          onClick={() => addEmojiToMessage(emoji)}
                          aria-label={`Adicionar ${emoji}`}
                        />
                      </WrapItem>
                    ))}
                  </Wrap>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <FileUpload 
              onFileUpload={handleFileUpload}
              disabled={sending}
            />
            <IconButton
              type="submit"
              icon={<ArrowForwardIcon />}
              bg="linear-gradient(135deg, #E6FFFA 0%, #B2F5EA 100%)"
              color="teal.600"
              borderRadius="full"
              size="md"
              isLoading={sending}
              disabled={!newMessage.trim()}
              border="2px solid"
              borderColor="teal.300"
              _hover={{ 
                transform: 'scale(1.05)',
                shadow: 'lg',
                bg: 'linear-gradient(135deg, #B2F5EA 0%, #81E6D9 100%)',
                borderColor: 'teal.400'
              }}
              _active={{ transform: 'scale(0.95)' }}
              transition="all 0.2s"
              aria-label="Enviar mensagem"
            />
          </Flex>
        </form>
      </Box>

      {/* Dialog de Confirmação para Limpar Chat */}
      <AlertDialog
        isOpen={isClearOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClearClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              🗑️ Limpar Todo o Chat
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack align="start" spacing={3}>
                <Text>
                  Tem certeza que deseja <strong>deletar TODAS as mensagens</strong> do chat?
                </Text>
                <Text color="red.600" fontWeight="bold">
                  ⚠️ Esta ação não pode ser desfeita!
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Todas as {messages.length} mensagens serão removidas permanentemente
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Todos os usuários perderão acesso ao histórico
                </Text>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClearClose}>
                Cancelar
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleClearChat} 
                ml={3}
                isLoading={clearing}
                loadingText="Limpando..."
              >
                Sim, Limpar Tudo
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Chat;