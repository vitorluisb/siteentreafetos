import React, { useState, useEffect, useCallback } from 'react';
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
  Progress,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { 
  AddIcon, 
  DownloadIcon, 
  DeleteIcon, 
  AttachmentIcon,
  ViewIcon 
} from '@chakra-ui/icons';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    file: null
  });
  const [deleteDocumentId, setDeleteDocumentId] = useState(null);
  
  const { user, isAdmin, userProfile } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  const toast = useToast();
  const cancelRef = React.useRef();

  const categories = [
    'Protocolos',
    'Formulários',
    'Manuais',
    'Relatórios',
    'Apresentações',
    'Documentos Legais',
    'Outros'
  ];

  useEffect(() => {
    // Não fazer consultas ao banco para usuários demo
    if (user?.id === '00000000-0000-4000-8000-000000000001' || user?.id === '00000000-0000-4000-8000-000000000002') {
      // Dados mockados para demonstração
      const mockDocuments = [
        {
          id: 1,
          name: 'Manual do Sistema',
          url: 'demo-manual.pdf',
          file_size: 1024000,
          file_type: 'application/pdf',
          sector: 'Documentação',
          uploaded_by: user.id,
          uploaded_at: new Date().toISOString(),
          users: { name: user?.user_metadata?.name || 'Demo User' }
        },
        {
          id: 2,
          name: 'Política de Privacidade',
          url: 'demo-privacy.pdf',
          file_size: 512000,
          file_type: 'application/pdf',
          sector: 'Documentos Legais',
          uploaded_by: user.id,
          uploaded_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          users: { name: user?.user_metadata?.name || 'Demo User' }
        }
      ];
      setDocuments(mockDocuments);
      setLoading(false);
      return;
    }
    
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments((data || []).map(doc => ({
        ...doc,
        users: {
          name: doc.uploaded_by === user?.id 
            ? (user?.user_metadata?.name || user?.email?.split('@')[0] || 'Você')
            : 'Equipe Entre Afetos'
        }
      })));
    } catch (error) {
      toast({
        title: 'Erro ao carregar documentos',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/*': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione um arquivo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Upload do arquivo para o Supabase Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, formData.file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          }
        });

      if (uploadError) throw uploadError;

      // Salvar informações do documento no banco
      const { error: dbError } = await supabase
        .from('documents')
        .insert([{
          title: formData.title,
          description: formData.description || null,
          file_url: filePath,
          file_name: formData.file.name,
          file_size: formData.file.size,
          file_type: formData.file.type,
          sector: formData.category,
          uploaded_by: user.id
        }]);

      if (dbError) throw dbError;

      toast({
        title: 'Documento enviado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      handleCloseModal();
      fetchDocuments();
    } catch (error) {
      toast({
        title: 'Erro ao enviar documento',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.file_url);

      if (error) throw error;

      // Criar URL para download
      const url = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.file_name || doc.title;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Download iniciado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao baixar documento',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const documentToDelete = documents.find(doc => doc.id === deleteDocumentId);
      
      // Deletar arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([documentToDelete.file_url]);

      if (storageError) throw storageError;

      // Deletar registro do banco
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', deleteDocumentId);

      if (dbError) throw dbError;

      toast({
        title: 'Documento excluído com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchDocuments();
    } catch (error) {
      toast({
        title: 'Erro ao excluir documento',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setDeleteDocumentId(null);
    }
  };

  const handleCloseModal = () => {
    setFormData({
      title: '',
      category: '',
      file: null
    });
    setUploadProgress(0);
    onClose();
  };

  const openDeleteDialog = (documentId) => {
    setDeleteDocumentId(documentId);
    onDeleteOpen();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Protocolos': 'blue',
      'Formulários': 'green',
      'Manuais': 'purple',
      'Relatórios': 'orange',
      'Apresentações': 'cyan',
      'Documentos Legais': 'red',
      'Outros': 'gray'
    };
    return colors[category] || 'gray';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
          Repositório de Documentos
        </Heading>
        {userProfile?.role !== 'user' && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Enviar Documento
          </Button>
        )}
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {documents.length === 0 ? (
          <GridItem colSpan="full">
            <Card>
              <CardBody>
                <Text textAlign="center" color="gray.500">
                  Nenhum documento encontrado. Envie o primeiro documento!
                </Text>
              </CardBody>
            </Card>
          </GridItem>
        ) : (
          documents.map((document) => (
            <Card key={document.id} shadow="md">
              <CardHeader>
                <VStack align="start" spacing={2}>
                  <Heading size="sm" color="gray.700" noOfLines={2}>
                    {document.title}
                  </Heading>
                  <HStack>
                    <Badge colorScheme={getCategoryColor(document.sector)}>
                      {document.sector}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {formatFileSize(document.file_size)}
                    </Text>
                  </HStack>
                </VStack>
              </CardHeader>
              
              <CardBody pt={0}>
                <VStack align="start" spacing={3}>
                  <Text fontSize="xs" color="gray.500">
                    Enviado por: {document.users?.name || 'Usuário desconhecido'}
                  </Text>
                  
                  <Text fontSize="xs" color="gray.500">
                    {new Date(document.uploaded_at).toLocaleDateString('pt-BR')}
                  </Text>

                  <HStack spacing={2} w="full">
                    <Button
                      size="sm"
                      leftIcon={<DownloadIcon />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleDownload(document)}
                      flex={1}
                    >
                      Baixar
                    </Button>
                    
                    {(isAdmin() || document.uploaded_by === user.id) && (
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => openDeleteDialog(document.id)}
                        aria-label="Excluir documento"
                      />
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))
        )}
      </Grid>

      {/* Modal para enviar documento */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Enviar Documento</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Digite o título do documento"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Selecione a categoria"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </FormControl>



                <FormControl isRequired>
                  <FormLabel>Arquivo</FormLabel>
                  <Box
                    {...getRootProps()}
                    border="2px dashed"
                    borderColor={isDragActive ? "blue.300" : "gray.300"}
                    borderRadius="md"
                    p={6}
                    textAlign="center"
                    cursor="pointer"
                    bg={isDragActive ? "blue.50" : "gray.50"}
                    transition="all 0.2s"
                  >
                    <input {...getInputProps()} />
                    <AttachmentIcon mb={2} color="gray.500" />
                    {formData.file ? (
                      <Text color="green.600" fontWeight="bold">
                        {formData.file.name}
                      </Text>
                    ) : (
                      <Text color="gray.600">
                        {isDragActive
                          ? "Solte o arquivo aqui..."
                          : "Clique ou arraste um arquivo aqui"}
                      </Text>
                    )}
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Máximo 10MB - PDF, DOC, XLS, PPT, imagens, TXT
                    </Text>
                  </Box>
                </FormControl>

                {uploading && (
                  <Box w="full">
                    <Text fontSize="sm" mb={2}>
                      Enviando... {Math.round(uploadProgress)}%
                    </Text>
                    <Progress value={uploadProgress} colorScheme="blue" />
                  </Box>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCloseModal} disabled={uploading}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                colorScheme="blue" 
                isLoading={uploading}
                loadingText="Enviando..."
              >
                Enviar
              </Button>
            </ModalFooter>
          </form>
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
              Excluir Documento
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
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

export default Documents;