import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Container,
  Image,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResendButton, setShowResendButton] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  
  const { signIn, user, resendConfirmation } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const from = location.state?.from?.pathname || '/admin/dashboard'

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await signIn(email, password)
      
      if (error) {
        let errorTitle = 'Erro no login'
        let errorDescription = error.message
        
        // Handle specific error cases
        if (error.message === 'Email not confirmed') {
          errorTitle = 'Email não confirmado'
          errorDescription = 'Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada e clique no link de confirmação.'
          setShowResendButton(true)
        } else if (error.message === 'Invalid login credentials') {
          errorTitle = 'Credenciais inválidas'
          errorDescription = 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.'
          setShowResendButton(false)
        } else {
          setShowResendButton(false)
        }
        
        setError(errorDescription)
        toast({
          title: errorTitle,
          description: errorDescription,
          status: 'error',
          duration: 7000,
          isClosable: true,
        })
        return
      }

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao painel administrativo',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      navigate(from, { replace: true })
    } catch (error) {
      setError('Erro inesperado. Tente novamente.')
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente em alguns instantes',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: 'Email necessário',
        description: 'Digite seu email para reenviar a confirmação.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setResendLoading(true)
    
    try {
      const { data, error } = await resendConfirmation(email)
      
      if (error) {
        toast({
          title: 'Erro ao reenviar confirmação',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        return
      }

      toast({
        title: 'Email de confirmação reenviado!',
        description: 'Verifique sua caixa de entrada e spam.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      setShowResendButton(false)
    } catch (error) {
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente em alguns instantes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Container maxW="md" centerContent>
      <Box
        w="100%"
        maxW="400px"
        p={8}
        mt={20}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={6}>
          <Image
            src="/logo/entreafetoslogo.png"
            alt="Entre Afetos"
            maxH="80px"
            objectFit="contain"
          />
          
          <Heading size="lg" textAlign="center" color="blue.600">
            Painel Interno
          </Heading>
          
          <Text textAlign="center" color="gray.600">
            Acesso exclusivo para colaboradores
          </Text>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Box as="form" onSubmit={handleSubmit} w="100%">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@entreafetos.com"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    focusBorderColor="blue.500"
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="100%"
                isLoading={loading}
                loadingText="Entrando..."
              >
                Entrar
              </Button>

              {showResendButton && (
                <Button
                  variant="outline"
                  colorScheme="orange"
                  size="md"
                  w="100%"
                  isLoading={resendLoading}
                  loadingText="Reenviando..."
                  onClick={handleResendConfirmation}
                >
                  Reenviar Email de Confirmação
                </Button>
              )}
            </VStack>
          </Box>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Problemas para acessar? Entre em contato com a administração.
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}

export default Login