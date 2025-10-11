import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  Flex,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  Link,
  Grid,
  AspectRatio
} from '@chakra-ui/react';
import { 
  DownloadIcon,
  ViewIcon,
  ExternalLinkIcon
} from '@chakra-ui/icons';

const FileMessage = ({ files, isOwnMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    const icons = {
      'image/jpeg': '🖼️',
      'image/png': '🖼️',
      'image/gif': '🖼️',
      'image/webp': '🖼️',
      'application/pdf': '📄',
      'application/msword': '📝',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
      'application/vnd.ms-excel': '📊',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
      'text/plain': '📄',
      'audio/mpeg': '🎵',
      'audio/wav': '🎵',
      'video/mp4': '🎬',
      'video/webm': '🎬'
    };
    return icons[type] || '📎';
  };

  const getFileColor = (type) => {
    const colors = {
      'image/jpeg': 'blue',
      'image/png': 'blue',
      'image/gif': 'blue',
      'image/webp': 'blue',
      'application/pdf': 'red',
      'application/msword': 'blue',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'blue',
      'application/vnd.ms-excel': 'green',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'green',
      'text/plain': 'gray',
      'audio/mpeg': 'purple',
      'audio/wav': 'purple',
      'video/mp4': 'orange',
      'video/webm': 'orange'
    };
    return colors[type] || 'gray';
  };

  const isImage = (type) => {
    return type.startsWith('image/');
  };

  const isVideo = (type) => {
    return type.startsWith('video/');
  };

  const isAudio = (type) => {
    return type.startsWith('audio/');
  };

  const handleFileView = (file) => {
    setSelectedFile(file);
    onOpen();
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFilePreview = (file) => {
    if (isImage(file.type)) {
      return (
        <Box
          position="relative"
          borderRadius="md"
          overflow="hidden"
          cursor="pointer"
          onClick={() => handleFileView(file)}
          _hover={{ transform: 'scale(1.02)' }}
          transition="transform 0.2s"
        >
          <AspectRatio ratio={16/9} maxW="200px">
            <Image
              src={file.url}
              alt={file.name}
              objectFit="cover"
              fallback={
                <Flex align="center" justify="center" bg="gray.100">
                  <Text fontSize="4xl">{getFileIcon(file.type)}</Text>
                </Flex>
              }
            />
          </AspectRatio>
          <Box
            position="absolute"
            top={2}
            right={2}
            bg="blackAlpha.600"
            borderRadius="full"
            p={1}
          >
            <ViewIcon color="white" boxSize={3} />
          </Box>
        </Box>
      );
    }

    if (isVideo(file.type)) {
      return (
        <Box
          borderRadius="md"
          overflow="hidden"
          maxW="300px"
        >
          <video
            controls
            style={{ width: '100%', height: 'auto' }}
            preload="metadata"
          >
            <source src={file.url} type={file.type} />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </Box>
      );
    }

    if (isAudio(file.type)) {
      return (
        <Box
          bg="gray.50"
          p={3}
          borderRadius="md"
          maxW="300px"
        >
          <HStack mb={2}>
            <Text fontSize="2xl">{getFileIcon(file.type)}</Text>
            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
              {file.name}
            </Text>
          </HStack>
          <audio controls style={{ width: '100%' }}>
            <source src={file.url} type={file.type} />
            Seu navegador não suporta o elemento de áudio.
          </audio>
        </Box>
      );
    }

    // Arquivo genérico
    return (
      <Flex
        bg="gray.50"
        p={3}
        borderRadius="md"
        align="center"
        justify="space-between"
        maxW="300px"
        border="1px"
        borderColor="gray.200"
      >
        <HStack flex={1} minW={0}>
          <Text fontSize="2xl">{getFileIcon(file.type)}</Text>
          <Box minW={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
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
        <HStack spacing={1}>
          {!isAudio(file.type) && !isVideo(file.type) && (
            <Tooltip label="Visualizar">
              <IconButton
                icon={<ViewIcon />}
                size="sm"
                variant="ghost"
                onClick={() => handleFileView(file)}
              />
            </Tooltip>
          )}
          <Tooltip label="Download">
            <IconButton
              icon={<DownloadIcon />}
              size="sm"
              variant="ghost"
              onClick={() => handleDownload(file)}
            />
          </Tooltip>
        </HStack>
      </Flex>
    );
  };

  return (
    <>
      <VStack spacing={2} align="stretch">
        {files.map((file, index) => (
          <Box key={index}>
            {renderFilePreview(file)}
          </Box>
        ))}
      </VStack>

      {/* Modal para visualização de arquivos */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text fontSize="2xl">{selectedFile && getFileIcon(selectedFile.type)}</Text>
              <Box>
                <Text fontSize="lg">{selectedFile?.name}</Text>
                <HStack spacing={2}>
                  <Badge colorScheme={selectedFile && getFileColor(selectedFile.type)} size="sm">
                    {selectedFile?.type.split('/')[1].toUpperCase()}
                  </Badge>
                  <Text fontSize="sm" color="gray.500">
                    {selectedFile && formatFileSize(selectedFile.size)}
                  </Text>
                </HStack>
              </Box>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedFile && (
              <Box textAlign="center">
                {isImage(selectedFile.type) && (
                  <Image
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    maxH="500px"
                    objectFit="contain"
                    mx="auto"
                  />
                )}
                
                {isVideo(selectedFile.type) && (
                  <video
                    controls
                    style={{ maxWidth: '100%', maxHeight: '500px' }}
                  >
                    <source src={selectedFile.url} type={selectedFile.type} />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                )}

                {!isImage(selectedFile.type) && !isVideo(selectedFile.type) && (
                  <VStack spacing={4}>
                    <Text fontSize="6xl">{getFileIcon(selectedFile.type)}</Text>
                    <Text>
                      Este tipo de arquivo não pode ser visualizado diretamente.
                    </Text>
                    <Link
                      href={selectedFile.url}
                      isExternal
                      color="blue.500"
                      fontWeight="medium"
                    >
                      Abrir em nova aba <ExternalLinkIcon mx="2px" />
                    </Link>
                  </VStack>
                )}

                <HStack justify="center" mt={4}>
                  <IconButton
                    icon={<DownloadIcon />}
                    colorScheme="blue"
                    onClick={() => handleDownload(selectedFile)}
                    aria-label="Download"
                  />
                  <Link
                    href={selectedFile.url}
                    isExternal
                  >
                    <IconButton
                      icon={<ExternalLinkIcon />}
                      colorScheme="gray"
                      aria-label="Abrir em nova aba"
                    />
                  </Link>
                </HStack>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FileMessage;