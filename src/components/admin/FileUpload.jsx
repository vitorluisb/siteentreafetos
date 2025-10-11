import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  useToast,
  Progress,
  Badge,
  Flex,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  Icon
} from '@chakra-ui/react';
import { 
  AttachmentIcon, 
  CloseIcon, 
  DownloadIcon,
  ViewIcon 
} from '@chakra-ui/icons';
import { supabase } from '../../config/supabase';

const FileUpload = ({ onFileUpload, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Tipos de arquivo permitidos
  const allowedTypes = {
    'image/jpeg': { icon: '🖼️', color: 'blue', maxSize: 5 * 1024 * 1024 }, // 5MB
    'image/png': { icon: '🖼️', color: 'blue', maxSize: 5 * 1024 * 1024 },
    'image/gif': { icon: '🖼️', color: 'blue', maxSize: 5 * 1024 * 1024 },
    'image/webp': { icon: '🖼️', color: 'blue', maxSize: 5 * 1024 * 1024 },
    'application/pdf': { icon: '📄', color: 'red', maxSize: 10 * 1024 * 1024 }, // 10MB
    'application/msword': { icon: '📝', color: 'blue', maxSize: 10 * 1024 * 1024 },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: '📝', color: 'blue', maxSize: 10 * 1024 * 1024 },
    'application/vnd.ms-excel': { icon: '📊', color: 'green', maxSize: 10 * 1024 * 1024 },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: '📊', color: 'green', maxSize: 10 * 1024 * 1024 },
    'text/plain': { icon: '📄', color: 'gray', maxSize: 5 * 1024 * 1024 },
    'audio/mpeg': { icon: '🎵', color: 'purple', maxSize: 20 * 1024 * 1024 }, // 20MB
    'audio/wav': { icon: '🎵', color: 'purple', maxSize: 20 * 1024 * 1024 },
    'video/mp4': { icon: '🎬', color: 'orange', maxSize: 50 * 1024 * 1024 }, // 50MB
    'video/webm': { icon: '🎬', color: 'orange', maxSize: 50 * 1024 * 1024 }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const fileType = allowedTypes[file.type];
    
    if (!fileType) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido: ${file.type}`
      };
    }

    if (file.size > fileType.maxSize) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo: ${formatFileSize(fileType.maxSize)}`
      };
    }

    return { valid: true };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      toast({
        title: 'Alguns arquivos não puderam ser adicionados',
        description: errors.join('\n'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onOpen();
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `chat-files/${fileName}`;

        // Upload para o Supabase Storage (usando bucket 'chat-attachments')
        const { data, error } = await supabase.storage
          .from('chat-attachments')
          .upload(filePath, file);

        if (error) throw error;

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('chat-attachments')
          .getPublicUrl(filePath);

        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl,
          path: filePath
        });

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // Chamar callback com os arquivos uploadados
      onFileUpload(uploadedFiles);

      toast({
        title: 'Arquivos enviados com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setSelectedFiles([]);
      onClose();

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro ao enviar arquivos',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (type) => {
    return allowedTypes[type]?.icon || '📎';
  };

  const getFileColor = (type) => {
    return allowedTypes[type]?.color || 'gray';
  };

  return (
    <>
      <Tooltip label="Anexar arquivos" placement="top">
        <IconButton
          icon={<AttachmentIcon />}
          variant="ghost"
          colorScheme="gray"
          size="sm"
          borderRadius="full"
          _hover={{ bg: 'gray.100' }}
          aria-label="Anexar arquivo"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        />
      </Tooltip>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        accept={Object.keys(allowedTypes).join(',')}
      />

      {/* Área de Drop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0,0,0,0.5)"
        display={isDragging ? 'flex' : 'none'}
        alignItems="center"
        justifyContent="center"
        zIndex={9999}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Box
          bg="white"
          p={8}
          borderRadius="xl"
          border="3px dashed"
          borderColor="blue.400"
          textAlign="center"
          maxW="400px"
        >
          <AttachmentIcon boxSize={12} color="blue.400" mb={4} />
          <Text fontSize="xl" fontWeight="bold" color="blue.600" mb={2}>
            Solte os arquivos aqui
          </Text>
          <Text color="gray.600">
            Arquivos suportados: Imagens, PDFs, Documentos, Áudio e Vídeo
          </Text>
        </Box>
      </Box>

      {/* Modal de Preview e Upload */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enviar Arquivos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              {selectedFiles.map((file, index) => (
                <Flex
                  key={index}
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  align="center"
                  justify="space-between"
                >
                  <HStack>
                    <Text fontSize="2xl">{getFileIcon(file.type)}</Text>
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">
                        {file.name}
                      </Text>
                      <HStack spacing={2}>
                        <Badge colorScheme={getFileColor(file.type)} size="sm">
                          {file.type.split('/')[1].toUpperCase()}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          {formatFileSize(file.size)}
                        </Text>
                      </HStack>
                    </Box>
                  </HStack>
                  <IconButton
                    icon={<CloseIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  />
                </Flex>
              ))}

              {isUploading && (
                <Box>
                  <Text fontSize="sm" mb={2}>
                    Enviando arquivos... {Math.round(uploadProgress)}%
                  </Text>
                  <Progress value={uploadProgress} colorScheme="blue" />
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} disabled={isUploading}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              onClick={uploadFiles}
              disabled={selectedFiles.length === 0}
              isLoading={isUploading}
              loadingText="Enviando..."
            >
              Enviar {selectedFiles.length} arquivo{selectedFiles.length !== 1 ? 's' : ''}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FileUpload;