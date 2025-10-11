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
  Center,
  Grid,
  GridItem,
  Divider,
  Avatar,
  AvatarGroup,
  Tooltip,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { 
  AddIcon, 
  DeleteIcon, 
  EditIcon,
  CalendarIcon,
  TimeIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon
} from '@chakra-ui/icons';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    category: 'meeting'
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'calendar'
  const [filterCategory, setFilterCategory] = useState('all');
  const [participants, setParticipants] = useState({});
  
  const { user, isAdmin, userProfile } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose
  } = useDisclosure();
  const toast = useToast();
  const cancelRef = React.useRef();

  const categories = [
    { value: 'meeting', label: 'Reunião', color: 'blue' },
    { value: 'training', label: 'Treinamento', color: 'green' },
    { value: 'consultation', label: 'Consulta', color: 'purple' },
    { value: 'workshop', label: 'Workshop', color: 'orange' },
    { value: 'conference', label: 'Conferência', color: 'red' },
    { value: 'other', label: 'Outro', color: 'gray' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Buscar eventos do Supabase
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, date, start_date, end_date, location, category, created_by, created_at')
        .order('start_date', { ascending: true });

      if (error) throw error;
      
      // Enriquecer dados com informações do criador e adicionar category padrão
      const enrichedEvents = (data || []).map(event => ({
        ...event,
        category: event.category || 'meeting', // Adicionar padrão se não existir
        users: {
          name: event.created_by === user?.id 
            ? (user?.user_metadata?.name || user?.email?.split('@')[0] || 'Você')
            : 'Equipe Entre Afetos'
        }
      }));
      
      setEvents(enrichedEvents);

    } catch (error) {
      toast({
        title: 'Erro ao carregar eventos',
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
    
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast({
        title: 'Erro',
        description: 'A data de início deve ser anterior à data de fim',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setSubmitting(true);

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.start_date, // Campo date (mesmo valor de start_date)
        start_date: formData.start_date,
        end_date: formData.end_date,
        location: formData.location,
        category: formData.category, // ✅ Campo category habilitado
        created_by: user.id
      };

      if (editingEvent) {
        // Atualizar evento existente
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        // Criar novo evento
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;
      }

      toast({
        title: editingEvent ? 'Evento atualizado!' : 'Evento criado!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      handleCloseModal();
      fetchEvents(); // Recarregar eventos
    } catch (error) {
      toast({
        title: 'Erro ao salvar evento',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Deletar evento do Supabase
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', deleteEventId);

      if (error) throw error;

      toast({
        title: 'Evento excluído!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchEvents(); // Recarregar eventos
    } catch (error) {
      toast({
        title: 'Erro ao excluir evento',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setDeleteEventId(null);
    }
  };

  const handleParticipation = async (eventId, status) => {
    try {
      // Simular participação (substitua pela consulta real do Supabase)
      toast({
        title: `Participação ${status === 'confirmed' ? 'confirmada' : 'cancelada'}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Código real do Supabase:
      /*
      const { data: existingParticipation } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (existingParticipation) {
        const { error } = await supabase
          .from('event_participants')
          .update({ status })
          .eq('id', existingParticipation.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_participants')
          .insert([{
            event_id: eventId,
            user_id: user.id,
            status
          }]);
        
        if (error) throw error;
      }

      fetchEvents();
      */
    } catch (error) {
      toast({
        title: 'Erro ao atualizar participação',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start_date: new Date(event.start_date).toISOString().slice(0, 16),
      end_date: new Date(event.end_date).toISOString().slice(0, 16),
      location: event.location || '',
      category: event.category
    });
    onOpen();
  };

  const handleCloseModal = () => {
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      location: '',
      category: 'meeting'
    });
    setEditingEvent(null);
    onClose();
  };

  const openDeleteDialog = (eventId) => {
    setDeleteEventId(eventId);
    onDeleteOpen();
  };

  const viewEventDetails = (event) => {
    setSelectedEvent(event);
    onViewOpen();
  };

  const getCategoryInfo = (category) => {
    return categories.find(cat => cat.value === category) || categories[categories.length - 1];
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isEventToday = (event) => {
    const today = new Date().toDateString();
    const eventDate = new Date(event.start_date).toDateString();
    return today === eventDate;
  };

  const isEventUpcoming = (event) => {
    const now = new Date();
    const eventStart = new Date(event.start_date);
    return eventStart > now;
  };

  const filteredEvents = events.filter(event => {
    if (filterCategory === 'all') return true;
    return event.category === filterCategory;
  });

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
          Agenda Compartilhada
        </Heading>
        <HStack>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            w="200px"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>
          {userProfile?.role !== 'user' && (
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Novo Evento
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Estatísticas rápidas */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        <Card
          bg="linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)"
          borderRadius="20px"
          shadow="lg"
          border="3px solid"
          borderColor="blue.400"
          _hover={{ 
            shadow: 'xl', 
            transform: 'translateY(-4px)',
            borderColor: 'blue.500',
            transition: 'all 0.3s ease'
          }}
          transition="all .3s"
          p={6}
        >
          <VStack spacing={3}>
            <Box 
              p={3} 
              bg="linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)" 
              borderRadius="full"
              border="2px solid"
              borderColor="blue.300"
            >
              <CalendarIcon boxSize={6} color="blue.600" />
            </Box>
            <Stat textAlign="center">
              <StatLabel color="gray.600" fontSize="sm">Total de Eventos</StatLabel>
              <StatNumber color="blue.600" fontSize="2xl">{events.length}</StatNumber>
              <StatHelpText color="gray.500" fontSize="xs">Este mês</StatHelpText>
            </Stat>
            <HStack spacing={1} justify="center">
              <Box w={2} h={2} bg="blue.400" borderRadius="full" />
              <Box w={2} h={2} bg="blue.300" borderRadius="full" />
              <Box w={2} h={2} bg="blue.200" borderRadius="full" />
            </HStack>
          </VStack>
        </Card>

        <Card
          bg="linear-gradient(135deg, #FFFFFF 0%, #FFF8F8 100%)"
          borderRadius="20px"
          shadow="lg"
          border="3px solid"
          borderColor="pink.400"
          _hover={{ 
            shadow: 'xl', 
            transform: 'translateY(-4px)',
            borderColor: 'pink.500',
            transition: 'all 0.3s ease'
          }}
          transition="all .3s"
          p={6}
        >
          <VStack spacing={3}>
            <Box 
              p={3} 
              bg="linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)" 
              borderRadius="full"
              border="2px solid"
              borderColor="pink.300"
            >
              <TimeIcon boxSize={6} color="pink.600" />
            </Box>
            <Stat textAlign="center">
              <StatLabel color="gray.600" fontSize="sm">Eventos Hoje</StatLabel>
              <StatNumber color="pink.600" fontSize="2xl">{events.filter(isEventToday).length}</StatNumber>
              <StatHelpText color="gray.500" fontSize="xs">Programados</StatHelpText>
            </Stat>
            <HStack spacing={1} justify="center">
              <Box w={2} h={2} bg="pink.400" borderRadius="full" />
              <Box w={2} h={2} bg="pink.300" borderRadius="full" />
              <Box w={2} h={2} bg="pink.200" borderRadius="full" />
            </HStack>
          </VStack>
        </Card>

        <Card
          bg="linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)"
          borderRadius="20px"
          shadow="lg"
          border="3px solid"
          borderColor="green.400"
          _hover={{ 
            shadow: 'xl', 
            transform: 'translateY(-4px)',
            borderColor: 'green.500',
            transition: 'all 0.3s ease'
          }}
          transition="all .3s"
          p={6}
        >
          <VStack spacing={3}>
            <Box 
              p={3} 
              bg="linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)" 
              borderRadius="full"
              border="2px solid"
              borderColor="green.300"
            >
              <CheckIcon boxSize={6} color="green.600" />
            </Box>
            <Stat textAlign="center">
              <StatLabel color="gray.600" fontSize="sm">Próximos Eventos</StatLabel>
              <StatNumber color="green.600" fontSize="2xl">{events.filter(isEventUpcoming).length}</StatNumber>
              <StatHelpText color="gray.500" fontSize="xs">Futuros</StatHelpText>
            </Stat>
            <HStack spacing={1} justify="center">
              <Box w={2} h={2} bg="green.400" borderRadius="full" />
              <Box w={2} h={2} bg="green.300" borderRadius="full" />
              <Box w={2} h={2} bg="green.200" borderRadius="full" />
            </HStack>
          </VStack>
        </Card>

        <Card
          bg="linear-gradient(135deg, #FFFFFF 0%, #FFFBF0 100%)"
          borderRadius="20px"
          shadow="lg"
          border="3px solid"
          borderColor="orange.400"
          _hover={{ 
            shadow: 'xl', 
            transform: 'translateY(-4px)',
            borderColor: 'orange.500',
            transition: 'all 0.3s ease'
          }}
          transition="all .3s"
          p={6}
        >
          <VStack spacing={3}>
            <Box 
              p={3} 
              bg="linear-gradient(135deg, #FFF3E0 0%, #FFCC80 100%)" 
              borderRadius="full"
              border="2px solid"
              borderColor="orange.300"
            >
              <InfoIcon boxSize={6} color="orange.600" />
            </Box>
            <Stat textAlign="center">
              <StatLabel color="gray.600" fontSize="sm">Categorias</StatLabel>
              <StatNumber color="orange.600" fontSize="2xl">{new Set(events.map(e => e.category)).size}</StatNumber>
              <StatHelpText color="gray.500" fontSize="xs">Diferentes</StatHelpText>
            </Stat>
            <HStack spacing={1} justify="center">
              <Box w={2} h={2} bg="orange.400" borderRadius="full" />
              <Box w={2} h={2} bg="orange.300" borderRadius="full" />
              <Box w={2} h={2} bg="orange.200" borderRadius="full" />
            </HStack>
          </VStack>
        </Card>
      </SimpleGrid>

      <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
        {filteredEvents.length === 0 ? (
          <GridItem colSpan="full">
            <Card>
              <CardBody>
                <Text textAlign="center" color="gray.500">
                  Nenhum evento encontrado. Crie o primeiro evento!
                </Text>
              </CardBody>
            </Card>
          </GridItem>
        ) : (
          filteredEvents.map((event) => {
            const categoryInfo = getCategoryInfo(event.category);
            const isToday = isEventToday(event);
            const isUpcoming = isEventUpcoming(event);

            return (
              <Card 
                key={event.id} 
                bg="linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)"
                borderRadius="20px"
                shadow="lg"
                border="3px solid"
                borderColor={isToday ? "blue.400" : categoryInfo.color + ".300"}
                _hover={{ 
                  shadow: 'xl', 
                  transform: 'translateY(-4px)',
                  borderColor: isToday ? "blue.500" : categoryInfo.color + ".400",
                  transition: 'all 0.3s ease'
                }}
                transition="all .3s"
              >
                <CardHeader pb={3}>
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full">
                      <HStack spacing={3} flex={1}>
                        <Box 
                          p={2} 
                          bg={`linear-gradient(135deg, ${categoryInfo.color}.100 0%, ${categoryInfo.color}.200 100%)`}
                          borderRadius="full"
                          border="2px solid"
                          borderColor={categoryInfo.color + ".300"}
                        >
                          <CalendarIcon boxSize={4} color={categoryInfo.color + ".600"} />
                        </Box>
                        <VStack align="start" spacing={0} flex={1}>
                          <Heading size="sm" color="gray.700" noOfLines={2}>
                            {event.title}
                          </Heading>
                          <Text fontSize="xs" color={categoryInfo.color + ".500"} fontWeight="medium">
                            {categoryInfo.label}
                          </Text>
                        </VStack>
                      </HStack>
                      <VStack spacing={1}>
                        {isToday && (
                          <Badge colorScheme="blue" borderRadius="full" px={3}>Hoje</Badge>
                        )}
                        {!isUpcoming && !isToday && (
                          <Badge colorScheme="gray" borderRadius="full" px={3}>Passado</Badge>
                        )}
                      </VStack>
                    </HStack>
                    
                    {event.description && (
                      <Text fontSize="sm" color="gray.600" noOfLines={2} pl={12}>
                        {event.description}
                      </Text>
                    )}
                  </VStack>
                </CardHeader>
                
                <CardBody pt={0} px={6} pb={6}>
                  <VStack align="start" spacing={4}>
                    <VStack align="start" spacing={3} w="full">
                      <HStack spacing={3}>
                        <Box 
                          p={2} 
                          bg={`linear-gradient(135deg, ${categoryInfo.color}.50 0%, ${categoryInfo.color}.100 100%)`}
                          borderRadius="full"
                          border="1px solid"
                          borderColor={categoryInfo.color + ".200"}
                        >
                          <CalendarIcon boxSize={3} color={categoryInfo.color + ".600"} />
                        </Box>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">
                          {formatDate(event.start_date)}
                        </Text>
                      </HStack>

                      <HStack spacing={3}>
                        <Box 
                          p={2} 
                          bg={`linear-gradient(135deg, ${categoryInfo.color}.50 0%, ${categoryInfo.color}.100 100%)`}
                          borderRadius="full"
                          border="1px solid"
                          borderColor={categoryInfo.color + ".200"}
                        >
                          <TimeIcon boxSize={3} color={categoryInfo.color + ".600"} />
                        </Box>
                        <Text fontSize="sm" color="gray.700" fontWeight="medium">
                          {formatTime(event.start_date)} - {formatTime(event.end_date)}
                        </Text>
                      </HStack>

                      {event.location && (
                        <HStack spacing={3}>
                          <Box 
                            p={2} 
                            bg={`linear-gradient(135deg, ${categoryInfo.color}.50 0%, ${categoryInfo.color}.100 100%)`}
                            borderRadius="full"
                            border="1px solid"
                            borderColor={categoryInfo.color + ".200"}
                          >
                            <InfoIcon boxSize={3} color={categoryInfo.color + ".600"} />
                          </Box>
                          <Text fontSize="sm" color="gray.700" fontWeight="medium" noOfLines={1}>
                            {event.location}
                          </Text>
                        </HStack>
                      )}
                    </VStack>

                    <Divider borderColor={categoryInfo.color + ".200"} />

                    <HStack justify="space-between" w="full" align="start">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xs" color="gray.500">
                          Criado por: {event.users?.name || 'Usuário desconhecido'}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatDate(event.created_at)}
                        </Text>
                      </VStack>

                      <HStack spacing={2} flexWrap="wrap">
                        {isUpcoming && (
                          <>
                            <Button
                              size="sm"
                              colorScheme="green"
                              variant="outline"
                              leftIcon={<CheckIcon />}
                              onClick={() => handleParticipation(event.id, 'confirmed')}
                              borderRadius="full"
                              border="2px solid"
                              _hover={{ bg: 'green.50', borderColor: 'green.400' }}
                            >
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              leftIcon={<CloseIcon />}
                              onClick={() => handleParticipation(event.id, 'declined')}
                              borderRadius="full"
                              border="2px solid"
                              _hover={{ bg: 'red.50', borderColor: 'red.400' }}
                            >
                              Recusar
                            </Button>
                          </>
                        )}
                        
                        <IconButton
                          icon={<InfoIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => viewEventDetails(event)}
                          aria-label="Ver detalhes"
                          borderRadius="full"
                          border="2px solid"
                          _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                        />
                        
                        {(isAdmin() || event.created_by === user.id) && userProfile?.role !== 'user' && (
                          <>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="orange"
                              variant="outline"
                              onClick={() => handleEdit(event)}
                              aria-label="Editar evento"
                              borderRadius="full"
                              border="2px solid"
                              _hover={{ bg: 'orange.50', borderColor: 'orange.400' }}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              onClick={() => openDeleteDialog(event.id)}
                              aria-label="Excluir evento"
                              borderRadius="full"
                              border="2px solid"
                              _hover={{ bg: 'red.50', borderColor: 'red.400' }}
                            />
                          </>
                        )}
                      </HStack>
                    </HStack>

                    {/* Elementos decorativos */}
                    <HStack spacing={1} justify="center" w="full" pt={2}>
                      <Box w={2} h={2} bg={categoryInfo.color + ".400"} borderRadius="full" />
                      <Box w={2} h={2} bg={categoryInfo.color + ".300"} borderRadius="full" />
                      <Box w={2} h={2} bg={categoryInfo.color + ".200"} borderRadius="full" />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            );
          })
        )}
      </Grid>

      {/* Modal para criar/editar evento */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {editingEvent ? 'Editar Evento' : 'Novo Evento'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Digite o título do evento"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Digite uma descrição (opcional)"
                    rows={3}
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Data/Hora de Início</FormLabel>
                    <Input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Data/Hora de Fim</FormLabel>
                    <Input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Local</FormLabel>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Digite o local do evento"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCloseModal} disabled={submitting}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                colorScheme="blue" 
                isLoading={submitting}
                loadingText="Salvando..."
              >
                {editingEvent ? 'Atualizar' : 'Criar'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Modal para ver detalhes do evento */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhes do Evento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <VStack align="start" spacing={4}>
                <Heading size="md">{selectedEvent.title}</Heading>
                
                {selectedEvent.description && (
                  <Text color="gray.600">{selectedEvent.description}</Text>
                )}

                <HStack>
                  <Badge colorScheme={getCategoryInfo(selectedEvent.category).color}>
                    {getCategoryInfo(selectedEvent.category).label}
                  </Badge>
                  {isEventToday(selectedEvent) && (
                    <Badge colorScheme="blue">Hoje</Badge>
                  )}
                </HStack>

                <Divider />

                <VStack align="start" spacing={2} w="full">
                  <HStack>
                    <CalendarIcon color="gray.500" />
                    <Text><strong>Data:</strong> {formatDate(selectedEvent.start_date)}</Text>
                  </HStack>

                  <HStack>
                    <TimeIcon color="gray.500" />
                    <Text>
                      <strong>Horário:</strong> {formatTime(selectedEvent.start_date)} - {formatTime(selectedEvent.end_date)}
                    </Text>
                  </HStack>

                  {selectedEvent.location && (
                    <HStack>
                      <InfoIcon color="gray.500" />
                      <Text><strong>Local:</strong> {selectedEvent.location}</Text>
                    </HStack>
                  )}
                </VStack>

                <Divider />

                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">
                    <strong>Criado por:</strong> {selectedEvent.users?.name || 'Usuário desconhecido'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    <strong>Data de criação:</strong> {formatDateTime(selectedEvent.created_at)}
                  </Text>
                </VStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onViewClose}>Fechar</Button>
          </ModalFooter>
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
              Excluir Evento
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
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

export default Calendar;