import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Avatar,
  Button,
  ButtonGroup,
  Divider,
  useColorModeValue,
  Spinner,
  Center,
  Tooltip
} from '@chakra-ui/react'
import {
  BellIcon,
  ChatIcon,
  CalendarIcon,
  AttachmentIcon,
  StarIcon,
  ViewIcon
} from '@chakra-ui/icons'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../config/supabase'
import { format, isToday, isTomorrow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import OnlineUsers from '../../components/admin/OnlineUsers'

const Dashboard = () => {
  const { userProfile } = useAuth()
  const [stats, setStats] = useState({
    notices: 0,
    messages: 0,
    events: 0,
    documents: 0
  })
  const [recentNotices, setRecentNotices] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [showActivity, setShowActivity] = useState(false)
  const [activityFilter, setActivityFilter] = useState('all')
  const navigate = useNavigate()

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const primaryHover = useColorModeValue('gray.50', 'gray.700')

  const getActionCategory = (action) => {
    const s = String(action || '').toLowerCase()
    if (s.includes('notice') || s.includes('aviso')) return 'notice'
    if (s.includes('event') || s.includes('evento')) return 'event'
    if (s.includes('doc')) return 'document'
    if (s.includes('message') || s.includes('mensagem')) return 'message'
    return 'other'
  }

  useEffect(() => {
    fetchDashboardData()
  }, [userProfile])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const [noticesCount, messagesCount, eventsCount, documentsCount] = await Promise.all([
        supabase.from('notices').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true })
      ])

      setStats({
        notices: noticesCount.count || 0,
        messages: messagesCount.count || 0,
        events: eventsCount.count || 0,
        documents: documentsCount.count || 0
      })

      // Fetch recent notices
      const { data: notices } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentNotices((notices || []).map(notice => ({
        ...notice,
        users: { name: 'Equipe Entre Afetos' }
      })))

      // Fetch upcoming events
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5)

      setUpcomingEvents((events || []).map(event => ({
        ...event,
        users: { name: 'Equipe Entre Afetos' }
      })))

      // Simular atividades recentes baseadas nos dados existentes
      const simulatedActivity = []
      
      // Adicionar atividades dos avisos recentes
      if (notices && notices.length > 0) {
        notices.slice(0, 3).forEach(notice => {
          simulatedActivity.push({
            id: `notice_${notice.id}`,
            action: 'post_notice',
            description: `Novo aviso: ${notice.title}`,
            created_at: notice.created_at,
            users: { name: 'Equipe Entre Afetos' }
          })
        })
      }
      
      // Adicionar atividades dos eventos recentes
      if (events && events.length > 0) {
        events.slice(0, 3).forEach(event => {
          simulatedActivity.push({
            id: `event_${event.id}`,
            action: 'create_event',
            description: `Evento criado: ${event.title}`,
            created_at: event.created_at,
            users: { name: 'Equipe Entre Afetos' }
          })
        })
      }
      
      // Ordenar por data mais recente e limitar a 10 itens
      const sortedActivity = simulatedActivity
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10)

      setRecentActivity(sortedActivity)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventDateLabel = (date) => {
    const eventDate = new Date(date)
    if (isToday(eventDate)) {
      return 'Hoje'
    } else if (isTomorrow(eventDate)) {
      return 'Amanhã'
    } else {
      return format(eventDate, 'dd/MM', { locale: ptBR })
    }
  }

  const getActivityIcon = (action) => {
    switch (action) {
      case 'post_notice':
        return <BellIcon color="blue.500" />
      case 'send_message':
        return <ChatIcon color="green.500" />
      case 'create_event':
        return <CalendarIcon color="purple.500" />
      case 'upload_document':
        return <AttachmentIcon color="orange.500" />
      default:
        return <ViewIcon color="gray.500" />
    }
  }

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  const activityFiltered = activityFilter === 'all'
    ? recentActivity
    : recentActivity.filter((a) => getActionCategory(a.action) === activityFilter)

  return (
    <Container maxW="7xl" py={6}>
      <VStack spacing={6} align="stretch">
        {/* Welcome Section - Melhorado */}
        <Card 
          bg="linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)"
          borderRadius="20px"
          shadow="lg"
          border="3px solid"
          borderColor="transparent"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #4A90E2 0%, #48BB78 50%, #ED64A6 100%)',
            borderRadius: '20px',
            padding: '3px',
            zIndex: 0
          }}
          _after={{
            content: '""',
            position: 'absolute',
            top: '3px',
            left: '3px',
            right: '3px',
            bottom: '3px',
            bg: 'linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)',
            borderRadius: '17px',
            zIndex: 1
          }}
        >
         <CardBody p={8} position="relative" zIndex={2}>
           <HStack spacing={4} align="center" mb={4}>
             <Box 
               p={3} 
               bg="linear-gradient(135deg, #E3F2FD 0%, #E8F5E8 50%, #FCE4EC 100%)" 
               borderRadius="full"
               border="2px solid"
               borderColor="blue.200"
             >
               <Text fontSize="2xl">👋</Text>
             </Box>
             <VStack align="start" spacing={1}>
               <Heading size="xl" color="gray.700" fontWeight="bold">
                 Bem-vindo, {userProfile?.name}!
               </Heading>
               <Text fontSize="lg" color="gray.600">
                 Aqui está um resumo das atividades da clínica hoje.
               </Text>
             </VStack>
           </HStack>
           
           {/* Decorative elements */}
           <HStack spacing={2} justify="center" mt={4}>
             <Box w={3} h={3} bg="blue.400" borderRadius="full" />
             <Box w={3} h={3} bg="green.400" borderRadius="full" />
             <Box w={3} h={3} bg="pink.400" borderRadius="full" />
             <Box w={3} h={3} bg="blue.300" borderRadius="full" />
             <Box w={3} h={3} bg="green.300" borderRadius="full" />
           </HStack>
         </CardBody>
       </Card>

        {/* Stats Grid - Melhorado com ícones e cores */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
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
            cursor="pointer"
            title="Abrir Avisos"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/admin/notices')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/admin/notices')}
            position="relative"
            overflow="hidden"
          >
            <CardBody p={6}>
              <HStack justify="space-between" align="start" mb={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Avisos Ativos</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="blue.600">{stats.notices}</Text>
                  <Text fontSize="xs" color="gray.500">Total de comunicados</Text>
                </Box>
                <Box 
                  p={3} 
                  bg="linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)" 
                  borderRadius="full"
                  border="2px solid"
                  borderColor="blue.300"
                >
                  <BellIcon boxSize={6} color="blue.600" />
                </Box>
              </HStack>
              <HStack spacing={1} justify="center">
                <Box w={2} h={2} bg="blue.400" borderRadius="full" />
                <Box w={2} h={2} bg="blue.300" borderRadius="full" />
                <Box w={2} h={2} bg="blue.200" borderRadius="full" />
              </HStack>
            </CardBody>
          </Card>

          <Card
            bg="linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)"
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
            cursor="pointer"
            title="Abrir Chat"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/admin/chat')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/admin/chat')}
          >
            <CardBody p={6}>
              <HStack justify="space-between" align="start" mb={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Mensagens</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="pink.600">{stats.messages}</Text>
                  <Text fontSize="xs" color="gray.500">Chat interno</Text>
                </Box>
                <Box 
                  p={3} 
                  bg="linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)" 
                  borderRadius="full"
                  border="2px solid"
                  borderColor="pink.300"
                >
                  <ChatIcon boxSize={6} color="pink.600" />
                </Box>
              </HStack>
              <HStack spacing={1} justify="center">
                <Box w={2} h={2} bg="pink.400" borderRadius="full" />
                <Box w={2} h={2} bg="pink.300" borderRadius="full" />
                <Box w={2} h={2} bg="pink.200" borderRadius="full" />
              </HStack>
            </CardBody>
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
            cursor="pointer"
            title="Abrir Agenda"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/admin/calendar')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/admin/calendar')}
          >
            <CardBody p={6}>
              <HStack justify="space-between" align="start" mb={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Eventos</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="green.600">{stats.events}</Text>
                  <Text fontSize="xs" color="gray.500">Agenda compartilhada</Text>
                </Box>
                <Box 
                  p={3} 
                  bg="linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)" 
                  borderRadius="full"
                  border="2px solid"
                  borderColor="green.300"
                >
                  <CalendarIcon boxSize={6} color="green.600" />
                </Box>
              </HStack>
              <HStack spacing={1} justify="center">
                <Box w={2} h={2} bg="green.400" borderRadius="full" />
                <Box w={2} h={2} bg="green.300" borderRadius="full" />
                <Box w={2} h={2} bg="green.200" borderRadius="full" />
              </HStack>
            </CardBody>
          </Card>

          <Card
            bg="linear-gradient(135deg, #FFFFFF 0%, #F8FFFE 100%)"
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
            cursor="pointer"
            title="Abrir Documentos"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/admin/documents')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/admin/documents')}
          >
            <CardBody p={6}>
              <HStack justify="space-between" align="start" mb={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>Documentos</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="orange.600">{stats.documents}</Text>
                  <Text fontSize="xs" color="gray.500">Repositório</Text>
                </Box>
                <Box 
                  p={3} 
                  bg="linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)" 
                  borderRadius="full"
                  border="2px solid"
                  borderColor="orange.300"
                >
                  <AttachmentIcon boxSize={6} color="orange.600" />
                </Box>
              </HStack>
              <HStack spacing={1} justify="center">
                <Box w={2} h={2} bg="orange.400" borderRadius="full" />
                <Box w={2} h={2} bg="orange.300" borderRadius="full" />
                <Box w={2} h={2} bg="orange.200" borderRadius="full" />
              </HStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Content Grid - Layout melhorado */}
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={6}>
          {/* Recent Notices - Melhorado com detalhes azul e verde claro */}
          <GridItem colSpan={{ base: 1, xl: 1 }}>
            <Card 
              bg={cardBg} 
              borderRadius="20px" 
              shadow="md"
              border="2px solid"
              borderColor="blue.100"
              _hover={{ 
                shadow: 'lg',
                borderColor: 'blue.200',
                transform: 'translateY(-2px)'
              }}
              transition="all 0.3s ease"
              h="fit-content"
            >
              <CardHeader pb={3}>
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Box 
                      p={3} 
                      bg="linear-gradient(135deg, #E3F2FD 0%, #F8BBD9 100%)" 
                      borderRadius="full"
                      border="2px solid"
                      borderColor="blue.200"
                    >
                      <BellIcon color="blue.600" boxSize={5} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Heading size="md" color="gray.700">Avisos Recentes</Heading>
                      <Text fontSize="xs" color="blue.500" fontWeight="medium">
                        Comunicados importantes
                      </Text>
                    </VStack>
                  </HStack>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme="blue" 
                    onClick={() => navigate('/admin/notices')}
                    borderRadius="full"
                    _hover={{ bg: 'blue.50', borderColor: 'blue.300' }}
                    border="2px solid"
                    borderColor="blue.200"
                  >
                    Ver todos
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={3} align="stretch">
                  {recentNotices.length > 0 ? (
                    recentNotices.slice(0, 3).map((notice, index) => (
                      <Box 
                        key={notice.id} 
                        p={4} 
                        bg="linear-gradient(135deg, #FFF8F8 0%, #F0F8FF 100%)"
                        borderRadius="12px"
                        border="1px solid"
                        borderColor="blue.100"
                        _hover={{ 
                          bg: 'linear-gradient(135deg, #FFF0F5 0%, #E6F3FF 100%)',
                          borderColor: 'blue.200',
                          transform: 'translateX(4px)'
                        }}
                        transition="all 0.2s ease"
                        cursor="pointer"
                        onClick={() => navigate('/admin/notices')}
                        position="relative"
                        _before={{
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '4px',
                          bg: index % 2 === 0 ? 'blue.400' : 'pink.400',
                          borderRadius: '0 4px 4px 0'
                        }}
                      >
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="semibold" fontSize="sm" noOfLines={1} color="gray.700">
                            {notice.title}
                          </Text>
                          {notice.sector && (
                            <Badge 
                              size="sm" 
                              colorScheme={index % 2 === 0 ? "blue" : "pink"} 
                              borderRadius="full"
                              variant="subtle"
                              border="1px solid"
                              borderColor={index % 2 === 0 ? "blue.200" : "pink.200"}
                            >
                              {notice.sector}
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="sm" color="gray.600" noOfLines={2} mb={2}>
                          {notice.content}
                        </Text>
                        <HStack justify="space-between">
                          <HStack spacing={2}>
                            <Box 
                              w={2} 
                              h={2} 
                              bg={index % 2 === 0 ? "blue.400" : "pink.400"} 
                              borderRadius="full" 
                            />
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                              Por {notice.users?.name}
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="blue.400" fontWeight="medium">
                            {format(new Date(notice.created_at), 'dd/MM HH:mm')}
                          </Text>
                        </HStack>
                      </Box>
                    ))
                  ) : (
                    <Box textAlign="center" py={8}>
                      <Box 
                        p={4} 
                        bg="blue.50" 
                        borderRadius="full" 
                        display="inline-block" 
                        mb={3}
                        border="2px solid"
                        borderColor="blue.100"
                      >
                        <BellIcon color="blue.300" boxSize={8} />
                      </Box>
                      <Text color="gray.500" fontSize="sm" mb={2}>
                        Nenhum aviso recente
                      </Text>
                      <Text fontSize="xs" color="blue.400">
                        Novos comunicados aparecerão aqui
                      </Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Upcoming Events - Melhorado com detalhes verde claro */}
          <GridItem colSpan={{ base: 1, xl: 1 }}>
            <Card 
              bg={cardBg} 
              borderRadius="20px" 
              shadow="md"
              border="2px solid"
              borderColor="green.100"
              _hover={{ 
                shadow: 'lg',
                borderColor: 'green.200',
                transform: 'translateY(-2px)'
              }}
              transition="all 0.3s ease"
              h="fit-content"
            >
              <CardHeader pb={3}>
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Box 
                      p={3} 
                      bg="linear-gradient(135deg, #E8F5E8 0%, #F8BBD9 100%)" 
                      borderRadius="full"
                      border="2px solid"
                      borderColor="green.200"
                    >
                      <CalendarIcon color="green.600" boxSize={5} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Heading size="md" color="gray.700">Próximos Eventos</Heading>
                      <Text fontSize="xs" color="green.500" fontWeight="medium">
                        Agenda compartilhada
                      </Text>
                    </VStack>
                  </HStack>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    colorScheme="green" 
                    onClick={() => navigate('/admin/calendar')}
                    borderRadius="full"
                    _hover={{ bg: 'green.50', borderColor: 'green.300' }}
                    border="2px solid"
                    borderColor="green.200"
                  >
                    Ver agenda
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={3} align="stretch">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 3).map((event, index) => (
                      <Box 
                        key={event.id} 
                        p={4} 
                        bg="linear-gradient(135deg, #F8FFF8 0%, #F0FFF0 100%)"
                        borderRadius="12px"
                        border="1px solid"
                        borderColor="green.100"
                        _hover={{ 
                          bg: 'linear-gradient(135deg, #F0FFF0 0%, #E6FFE6 100%)',
                          borderColor: 'green.200',
                          transform: 'translateX(4px)'
                        }}
                        transition="all 0.2s ease"
                        cursor="pointer"
                        onClick={() => navigate('/admin/calendar')}
                        position="relative"
                        _before={{
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '4px',
                          bg: index % 2 === 0 ? 'green.400' : 'pink.400',
                          borderRadius: '0 4px 4px 0'
                        }}
                      >
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="semibold" fontSize="sm" noOfLines={1} color="gray.700">
                            {event.title}
                          </Text>
                          <Badge 
                            size="sm" 
                            colorScheme={index % 2 === 0 ? "green" : "pink"} 
                            borderRadius="full"
                            variant="subtle"
                            border="1px solid"
                            borderColor={index % 2 === 0 ? "green.200" : "pink.200"}
                          >
                            {getEventDateLabel(event.date)}
                          </Badge>
                        </HStack>
                        {event.description && (
                          <Text fontSize="sm" color="gray.600" noOfLines={2} mb={2}>
                            {event.description}
                          </Text>
                        )}
                        <HStack justify="space-between">
                          <HStack spacing={2}>
                            <Box 
                              w={2} 
                              h={2} 
                              bg={index % 2 === 0 ? "green.400" : "pink.400"} 
                              borderRadius="full" 
                            />
                            <Text fontSize="xs" color="gray.500" fontWeight="medium">
                              Por {event.users?.name}
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="green.400" fontWeight="medium">
                            {format(new Date(event.date), 'HH:mm')}
                          </Text>
                        </HStack>
                      </Box>
                    ))
                  ) : (
                    <Box textAlign="center" py={8}>
                      <Box 
                        p={4} 
                        bg="green.50" 
                        borderRadius="full" 
                        display="inline-block" 
                        mb={3}
                        border="2px solid"
                        borderColor="green.100"
                      >
                        <CalendarIcon color="green.300" boxSize={8} />
                      </Box>
                      <Text color="gray.500" fontSize="sm" mb={3}>
                        Nenhum evento próximo
                      </Text>
                      <Button 
                        size="sm" 
                        colorScheme="green" 
                        variant="outline" 
                        onClick={() => navigate('/admin/calendar')}
                        borderRadius="full"
                        border="2px solid"
                        borderColor="green.200"
                        _hover={{ bg: 'green.50', borderColor: 'green.300' }}
                      >
                        Criar evento
                      </Button>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Recent Activity - Melhorado com detalhes azul e verde claro */}
          <GridItem colSpan={{ base: 1, lg: 2, xl: 1 }}>
            <Card 
              bg={cardBg} 
              borderRadius="20px" 
              shadow="md"
              border="2px solid"
              borderColor="pink.100"
              _hover={{ 
                shadow: 'lg',
                borderColor: 'pink.200',
                transform: 'translateY(-2px)'
              }}
              transition="all 0.3s ease"
              h="fit-content"
            >
              <CardHeader pb={3}>
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <HStack spacing={3}>
                      <Box 
                        p={2} 
                        bg="linear-gradient(135deg, #FCE4EC 0%, #E3F2FD 100%)" 
                        borderRadius="full"
                        border="2px solid"
                        borderColor="pink.200"
                      >
                        <ViewIcon color="pink.600" boxSize={5} />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Heading size="md" color="gray.700">Atividade Recente</Heading>
                        <Text fontSize="xs" color="pink.500" fontWeight="medium">
                          Últimas ações da equipe
                        </Text>
                      </VStack>
                    </HStack>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setShowActivity(v => !v)}
                      borderRadius="full"
                      display={{ base: 'flex', md: 'none' }}
                      _hover={{ bg: 'pink.50' }}
                    >
                      {showActivity ? 'Ocultar' : 'Mostrar'}
                    </Button>
                  </HStack>
                  <HStack spacing={1} flexWrap="wrap">
                    {[
                      { key: 'all', label: 'Tudo', color: 'gray' },
                      { key: 'notice', label: 'Avisos', color: 'blue' },
                      { key: 'event', label: 'Eventos', color: 'green' },
                      { key: 'document', label: 'Docs', color: 'pink' },
                      { key: 'message', label: 'Msgs', color: 'pink' }
                    ].map((opt) => (
                      <Button
                        key={opt.key}
                        size="xs"
                        variant={activityFilter === opt.key ? 'solid' : 'outline'}
                        colorScheme={opt.color}
                        onClick={() => setActivityFilter(opt.key)}
                        borderRadius="full"
                        fontSize="xs"
                        border="1px solid"
                        borderColor={`${opt.color}.200`}
                        _hover={{ 
                          bg: `${opt.color}.50`,
                          borderColor: `${opt.color}.300`
                        }}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </HStack>
                </VStack>
              </CardHeader>
              <CardBody pt={0} display={{ base: showActivity ? 'block' : 'none', md: 'block' }}>
                <VStack spacing={3} align="stretch">
                  {activityFiltered.length > 0 ? (
                    activityFiltered.slice(0, 5).map((activity, index) => {
                      const getActivityColor = (action) => {
                        switch (action) {
                          case 'post_notice':
                            return { bg: 'blue.50', border: 'blue.100', accent: 'blue.400', icon: 'blue.500' }
                          case 'create_event':
                            return { bg: 'green.50', border: 'green.100', accent: 'green.400', icon: 'green.500' }
                          case 'upload_document':
                            return { bg: 'pink.50', border: 'pink.100', accent: 'pink.400', icon: 'pink.500' }
                          case 'send_message':
                            return { bg: 'pink.50', border: 'pink.100', accent: 'pink.400', icon: 'pink.500' }
                          default:
                            return { bg: 'gray.50', border: 'gray.100', accent: 'gray.400', icon: 'gray.500' }
                        }
                      }
                      
                      const colors = getActivityColor(activity.action)
                      
                      return (
                        <Box key={activity.id}>
                          <Box
                            p={4}
                            bg={`linear-gradient(135deg, ${colors.bg} 0%, white 100%)`}
                            borderRadius="12px"
                            border="1px solid"
                            borderColor={colors.border}
                            _hover={{ 
                              bg: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg} 100%)`,
                              borderColor: colors.accent,
                              transform: 'translateX(4px)'
                            }}
                            transition="all 0.2s ease"
                            position="relative"
                            _before={{
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: '4px',
                              bg: colors.accent,
                              borderRadius: '0 4px 4px 0'
                            }}
                          >
                            <HStack spacing={3} align="start">
                              <Box 
                                p={2} 
                                bg={colors.bg}
                                borderRadius="full"
                                flexShrink={0}
                                border="2px solid"
                                borderColor={colors.border}
                              >
                                {getActivityIcon(activity.action)}
                              </Box>
                              <VStack spacing={1} align="start" flex={1}>
                                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                  {activity.description}
                                </Text>
                                <HStack spacing={2} align="center">
                                  <Box 
                                    w={2} 
                                    h={2} 
                                    bg={colors.accent} 
                                    borderRadius="full" 
                                  />
                                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                    {activity.users?.name}
                                  </Text>
                                  <Text fontSize="xs" color="gray.300">•</Text>
                                  <Text fontSize="xs" color={colors.icon} fontWeight="medium">
                                    {format(new Date(activity.created_at), 'dd/MM HH:mm')}
                                  </Text>
                                </HStack>
                              </VStack>
                            </HStack>
                          </Box>
                          {index < activityFiltered.slice(0, 5).length - 1 && (
                            <Box h={3} />
                          )}
                        </Box>
                      )
                    })
                  ) : (
                    <Box textAlign="center" py={8}>
                      <Box 
                        p={4} 
                        bg="linear-gradient(135deg, #FCE4EC 0%, #E3F2FD 100%)" 
                        borderRadius="full" 
                        display="inline-block" 
                        mb={3}
                        border="2px solid"
                        borderColor="pink.100"
                      >
                        <ViewIcon color="pink.300" boxSize={8} />
                      </Box>
                      <Text color="gray.500" fontSize="sm" mb={2}>
                        Nenhuma atividade recente
                      </Text>
                      <Text fontSize="xs" color="pink.400">
                        As ações da equipe aparecerão aqui
                      </Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Online Users - Seção separada e melhorada */}
        <Box>
          <OnlineUsers />
        </Box>

      </VStack>
    </Container>
  )
}

export default Dashboard