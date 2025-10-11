import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Inactive Component - Página exibida quando o usuário está inativo
 * 
 * Esta página é mostrada quando um usuário tenta acessar o painel administrativo
 * mas sua conta está marcada como inativa no sistema.
 * 
 * @returns {JSX.Element} Página de usuário inativo
 */
const Inactive = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="md">
        <VStack spacing={8} align="center">
          <Box
            bg={cardBg}
            p={8}
            rounded="lg"
            shadow="lg"
            textAlign="center"
            w="full"
          >
            <Icon
              as={FiAlertCircle}
              w={16}
              h={16}
              color="orange.500"
              mb={4}
            />
            
            <Heading size="lg" mb={4} color="orange.500">
              Conta Inativa
            </Heading>
            
            <Text mb={6} color="gray.600">
              Sua conta está temporariamente inativa. Entre em contato com o 
              administrador do sistema para reativar seu acesso.
            </Text>
            
            <VStack spacing={4}>
              <Button
                colorScheme="blue"
                onClick={handleSignOut}
                w="full"
              >
                Fazer Logout
              </Button>
              
              <Text fontSize="sm" color="gray.500">
                Precisa de ajuda? Entre em contato conosco.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Inactive;