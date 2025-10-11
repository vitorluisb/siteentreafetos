import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Divider,
  Spinner
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { setCurrentUserAsAdmin, checkUserRole } from '../../utils/adminSetup';

const SetupAdmin = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const toast = useToast();

  // Check current user role on component mount
  useEffect(() => {
    const checkRole = async () => {
      const { role } = await checkUserRole();
      setCurrentRole(role);
    };
    checkRole();
  }, []);

  const handleSetAsAdmin = async () => {
    try {
      setLoading(true);
      const result = await setCurrentUserAsAdmin();
      
      if (result.success) {
        setCurrentRole('admin');
        toast({
          title: 'Sucesso!',
          description: 'Usuário definido como administrador. Faça logout e login novamente para aplicar as mudanças.',
          status: 'success',
          duration: 8000,
          isClosable: true,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: `Erro ao definir usuário como administrador: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Heading size="lg" color="gray.700" mb={6}>
        Configuração de Administrador
      </Heading>

      <VStack spacing={6} align="stretch">
        {/* Informações do Usuário Atual */}
        <Card>
          <CardHeader>
            <Heading size="md">Informações do Usuário</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={3}>
              <HStack>
                <Text fontWeight="bold">Email:</Text>
                <Text>{user?.email || 'Não logado'}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Role Atual:</Text>
                <Badge colorScheme={currentRole === 'admin' ? 'green' : 'gray'}>
                  {currentRole || userProfile?.role || 'user'}
                </Badge>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Nome:</Text>
                <Text>{userProfile?.name || user?.user_metadata?.name || 'Não definido'}</Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Ação para Definir como Admin */}
        <Card>
          <CardHeader>
            <Heading size="md">Definir como Administrador</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>Atenção!</AlertTitle>
                  <AlertDescription>
                    Esta ação irá definir o usuário atual como administrador. 
                    Após clicar no botão, você precisará fazer logout e login novamente 
                    para que as mudanças tenham efeito.
                  </AlertDescription>
                </Box>
              </Alert>

              <Button
                colorScheme="red"
                size="lg"
                onClick={handleSetAsAdmin}
                isLoading={loading}
                loadingText="Definindo como Admin..."
                disabled={!user}
              >
                {loading ? <Spinner size="sm" mr={2} /> : null}
                Definir como Administrador
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Divider />

        {/* Método Alternativo via SQL */}
        <Card>
          <CardHeader>
            <Heading size="md">Método Alternativo (SQL)</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={3}>
              <Text>
                Se o botão acima não funcionar, você pode executar este comando SQL 
                no Supabase SQL Editor:
              </Text>
              <Code p={3} borderRadius="md" w="full" fontSize="sm">
                {`UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = '${user?.email || 'seu-email@exemplo.com'}';`}
              </Code>
              <Alert status="warning" size="sm">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  Execute este comando no SQL Editor do Supabase Dashboard.
                </AlertDescription>
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default SetupAdmin;