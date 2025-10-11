import React, { useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Badge,
  Image
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  BellIcon,
  SettingsIcon,
  ChatIcon,
  CalendarIcon,
  AttachmentIcon,
  QuestionIcon,
  StarIcon,
  ViewIcon
} from '@chakra-ui/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const AdminLayout = () => {
  const { userProfile, signOut, getDisplayName } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, lg: false })

  const menuItems = [
    {
      label: 'Dashboard',
      icon: ViewIcon,
      path: '/admin/dashboard',
      roles: ['admin', 'psicologo', 'equipe']
    },
    {
      label: 'Mural de Avisos',
      icon: BellIcon,
      path: '/admin/notices',
      roles: ['admin', 'psicologo', 'equipe', 'user']
    },
    {
      label: 'Chat Interno',
      icon: ChatIcon,
      path: '/admin/chat',
      roles: ['admin', 'psicologo', 'equipe', 'user']
    },
    {
      label: 'Agenda',
      icon: CalendarIcon,
      path: '/admin/calendar',
      roles: ['admin', 'psicologo', 'equipe', 'user']
    },
    {
      label: 'Documentos',
      icon: AttachmentIcon,
      path: '/admin/documents',
      roles: ['admin', 'psicologo', 'equipe', 'user']
    },
    {
      label: 'Enquetes',
      icon: StarIcon,
      path: '/admin/polls',
      roles: ['admin', 'psicologo', 'equipe', 'user']
    },
    {
      label: 'Usuários',
      icon: SettingsIcon,
      path: '/admin/users',
      roles: ['admin']
    }
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userProfile?.role)
  )

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'red'
      case 'psicologo':
        return 'blue'
      case 'equipe':
        return 'green'
      case 'user':
        return 'purple'
      default:
        return 'gray'
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'psicologo':
        return 'Psicólogo'
      case 'equipe':
        return 'Equipe'
      case 'user':
        return 'Usuário'
      default:
        return 'Usuário'
    }
  }

  const SidebarContent = () => (
    <VStack spacing={0} align="stretch" h="100%">
      {/* Logo */}
      <Box p={6} borderBottomWidth={1}>
        <Image
          src="/logo/entreafetoslogo.png"
          alt="Entre Afetos"
          maxH="80px"
          objectFit="contain"
          mx="auto"
        />
        <Text
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
          mt={2}
          color="blue.600"
        >
          Painel Interno
        </Text>
      </Box>

      {/* Navigation */}
      <VStack spacing={2} align="stretch" flex={1} p={4}>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Button
              key={item.path}
              leftIcon={<item.icon />}
              variant={isActive ? 'solid' : 'ghost'}
              colorScheme={isActive ? 'blue' : 'gray'}
              justifyContent="flex-start"
              onClick={() => {
                navigate(item.path)
                if (isMobile) onClose()
              }}
              size="md"
              w="100%"
              h="44px"
              borderRadius="full"
              fontWeight="semibold"
              transition="all .2s"
              _hover={{ bg: isActive ? 'blue.600' : 'gray.100' }}
              _active={{ transform: 'scale(0.98)' }}
              _focusVisible={{ boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' }}
            >
              {item.label}
            </Button>
          )
        })}
      </VStack>

      {/* User Info */}
      <Box p={4} borderTopWidth={1}>
        <HStack spacing={3}>
          <Avatar size="md" name={getDisplayName()} src={userProfile?.avatar_url || undefined} />
          <VStack spacing={0} align="start" flex={1}>
            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
              {getDisplayName()}
            </Text>
            <Badge
              size="sm"
              colorScheme={getRoleBadgeColor(userProfile?.role)}
              variant="subtle"
            >
              {getRoleLabel(userProfile?.role)}
            </Badge>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  )

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box w="280px" bg="white" borderRightWidth={1} shadow="sm">
          <SidebarContent />
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <SidebarContent />
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Flex direction="column" flex={1}>
        {/* Header */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="100%"
          px={{ base: 3, md: 6 }}
          py={{ base: 3, md: 4 }}
          bg="white"
          borderBottomWidth={1}
          shadow="sm"
          position="sticky"
          top={0}
          zIndex={10}
        >
          <HStack spacing={4}>
            {isMobile && (
              <IconButton
                icon={<HamburgerIcon />}
                variant="ghost"
                onClick={onOpen}
                aria-label="Abrir menu"
                size="lg"
                h="44px"
              />
            )}
            <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} fontWeight="semibold" color="gray.800">
              {filteredMenuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </Text>
          </HStack>

          <HStack spacing={4}>
            <IconButton
              icon={<BellIcon />}
              variant="ghost"
              aria-label="Notificações"
              size="lg"
              h="44px"
            />
            
            <Menu>
              <MenuButton as={Button} variant="ghost" p={0} aria-label="Abrir menu do usuário">
                <Avatar size="md" name={getDisplayName()} src={userProfile?.avatar_url || undefined} />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <VStack spacing={1} align="start">
                    <Text fontWeight="medium">{getDisplayName()}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {userProfile?.email}
                    </Text>
                    <Badge
                      size="sm"
                      colorScheme={getRoleBadgeColor(userProfile?.role)}
                    >
                      {getRoleLabel(userProfile?.role)}
                    </Badge>
                  </VStack>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => navigate('/admin/profile')}>
                  👤 Meu Perfil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  🚪 Sair
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Page Content */}
        <Box flex={1} overflow="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}

export default AdminLayout