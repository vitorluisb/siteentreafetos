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
  GridItem,
  Switch,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  CheckboxGroup,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { 
  AddIcon, 
  DeleteIcon, 
  EditIcon,
  ViewIcon,
  CheckIcon,
  CloseIcon
} from '@chakra-ui/icons';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    active: true,
    ends_at: '',
    options: ['', '']
  });
  const [editingPoll, setEditingPoll] = useState(null);
  const [deletePollId, setDeletePollId] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  
  const { user, userProfile, isAdmin } = useAuth();
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

  useEffect(() => {
    fetchPolls();
    fetchUserVotes();
  }, [user]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options (
            id,
            option_text
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Buscar contagem de votos para cada opção
      const pollsWithVotes = await Promise.all((data || []).map(async (poll) => {
        const optionsWithVotes = await Promise.all(
          (poll.poll_options || []).map(async (option) => {
            const { count, error: countError } = await supabase
              .from('poll_votes')
              .select('*', { count: 'exact', head: true })
              .eq('option_id', option.id);
            
            return {
              ...option,
              votes_count: count || 0
            };
          })
        );
        
        return {
          ...poll,
          users: { name: 'Equipe Entre Afetos' },
          poll_options: optionsWithVotes
        };
      }));
      
      setPolls(pollsWithVotes);
    } catch (error) {
      toast({
        title: 'Erro ao carregar enquetes',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('poll_votes')
        .select('poll_id, option_id')
        .eq('user_id', user.id);

      if (error) {
        // Se a tabela não existir ou houver erro de estrutura, apenas definir votos vazios
        console.warn('Tabela poll_votes não encontrada ou erro na consulta:', error);
        setUserVotes({});
        return;
      }

      const votesMap = {};
      data?.forEach(vote => {
        if (!votesMap[vote.poll_id]) {
          votesMap[vote.poll_id] = [];
        }
        votesMap[vote.poll_id].push(vote.option_id);
      });
      
      setUserVotes(votesMap);
    } catch (error) {
      console.error('Erro ao carregar votos do usuário:', error);
      setUserVotes({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.options.filter(opt => opt.trim()).length < 2) {
      toast({
        title: 'Erro',
        description: 'É necessário pelo menos 2 opções válidas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setSubmitting(true);

      const pollData = {
        question: formData.question,
        description: formData.description,
        active: formData.active,
        ends_at: formData.ends_at || null,
        author_id: user.id
      };

      let pollId;

      if (editingPoll) {
        // Atualizar enquete existente
        const { error: updateError } = await supabase
          .from('polls')
          .update(pollData)
          .eq('id', editingPoll.id);

        if (updateError) throw updateError;

        // Deletar opções antigas
        const { error: deleteOptionsError } = await supabase
          .from('poll_options')
          .delete()
          .eq('poll_id', editingPoll.id);

        if (deleteOptionsError) throw deleteOptionsError;

        pollId = editingPoll.id;
      } else {
        // Criar nova enquete
        const { data: pollResult, error: pollError } = await supabase
          .from('polls')
          .insert([pollData])
          .select()
          .single();

        if (pollError) throw pollError;
        pollId = pollResult.id;
      }

      // Inserir opções
      const options = formData.options
        .filter(opt => opt.trim())
        .map(option => ({
          poll_id: pollId,
          option_text: option.trim()
        }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(options);

      if (optionsError) throw optionsError;

      toast({
        title: editingPoll ? 'Enquete atualizada!' : 'Enquete criada!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      handleCloseModal();
      fetchPolls();
    } catch (error) {
      toast({
        title: 'Erro ao salvar enquete',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      // Verificar se já votou nesta enquete
      const existingVotes = userVotes[pollId] || [];
      
      if (existingVotes.includes(optionId)) {
        // Remover voto
        const { error } = await supabase
          .from('poll_votes')
          .delete()
          .eq('poll_id', pollId)
          .eq('option_id', optionId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Adicionar voto
        const { error } = await supabase
          .from('poll_votes')
          .insert([{
            poll_id: pollId,
            option_id: optionId,
            user_id: user.id
          }]);

        if (error) throw error;
      }

      // Atualizar estado local
      fetchUserVotes();
      fetchPolls();

      toast({
        title: 'Voto registrado!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao votar',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', deletePollId);

      if (error) throw error;

      toast({
        title: 'Enquete excluída!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchPolls();
    } catch (error) {
      toast({
        title: 'Erro ao excluir enquete',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setDeletePollId(null);
    }
  };

  const handleEdit = (poll) => {
    setEditingPoll(poll);
    setFormData({
      question: poll.question,
      description: poll.description || '',
      active: poll.active,
      ends_at: poll.ends_at ? new Date(poll.ends_at).toISOString().slice(0, 16) : '',
      options: poll.poll_options?.map(opt => opt.option_text) || ['', '']
    });
    onOpen();
  };

  const handleCloseModal = () => {
    setFormData({
      question: '',
      description: '',
      active: true,
      ends_at: '',
      options: ['', '']
    });
    setEditingPoll(null);
    onClose();
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const openDeleteDialog = (pollId) => {
    setDeletePollId(pollId);
    onDeleteOpen();
  };

  const viewPollDetails = (poll) => {
    setSelectedPoll(poll);
    onViewOpen();
  };

  const getTotalVotes = (poll) => {
    return poll.poll_options?.reduce((total, option) => total + (option.votes_count || 0), 0) || 0;
  };

  const getVotePercentage = (option, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes_count / totalVotes) * 100);
  };

  const isPollExpired = (poll) => {
    return poll.ends_at && new Date(poll.ends_at) < new Date();
  };

  const canUserVote = (poll) => {
    return poll.active && !isPollExpired(poll);
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
          Enquetes e Feedback
        </Heading>
        {userProfile?.role !== 'user' && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Nova Enquete
          </Button>
        )}
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
        {polls.length === 0 ? (
          <GridItem colSpan="full">
            <Card>
              <CardBody>
                <Text textAlign="center" color="gray.500">
                  Nenhuma enquete encontrada. Crie a primeira enquete!
                </Text>
              </CardBody>
            </Card>
          </GridItem>
        ) : (
          polls.map((poll) => {
            const totalVotes = getTotalVotes(poll);
            const userVotedOptions = userVotes[poll.id] || [];
            const canVote = canUserVote(poll);

            return (
              <Box
                key={poll.id}
                position="relative"
                bg="linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
                borderRadius="16px"
                border="3px solid"
                borderColor={poll.active && !isPollExpired(poll) ? "#38a169" : isPollExpired(poll) ? "#ed8936" : "#e53e3e"}
                p={6}
                shadow="lg"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "xl",
                  borderColor: poll.active && !isPollExpired(poll) ? "#2f855a" : isPollExpired(poll) ? "#dd6b20" : "#c53030"
                }}
                _before={{
                  content: '""',
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  bg: poll.active && !isPollExpired(poll) ? "#38a169" : isPollExpired(poll) ? "#ed8936" : "#e53e3e",
                  opacity: 0.3
                }}
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '12px',
                  right: '24px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  bg: poll.active && !isPollExpired(poll) ? "#38a169" : isPollExpired(poll) ? "#ed8936" : "#e53e3e",
                  opacity: 0.2
                }}
              >
                <VStack align="start" spacing={4}>
                  <VStack align="start" spacing={2} w="full">
                    <HStack justify="space-between" w="full">
                      <Heading size="sm" color="gray.700" noOfLines={2} flex={1}>
                        {poll.question}
                      </Heading>
                      <HStack>
                        {!poll.active && (
                          <Badge colorScheme="red" borderRadius="full" px={3}>Inativa</Badge>
                        )}
                        {isPollExpired(poll) && (
                          <Badge colorScheme="orange" borderRadius="full" px={3}>Expirada</Badge>
                        )}
                        {poll.active && !isPollExpired(poll) && (
                          <Badge colorScheme="green" borderRadius="full" px={3}>Ativa</Badge>
                        )}
                      </HStack>
                    </HStack>
                    
                    {poll.description && (
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {poll.description}
                      </Text>
                    )}
                  </VStack>
                  
                  <VStack align="start" spacing={3}>
                    {poll.poll_options?.map((option) => {
                      const percentage = getVotePercentage(option, totalVotes);
                      const hasVoted = userVotedOptions.includes(option.id);

                      return (
                        <Box key={option.id} w="full">
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="sm" fontWeight={hasVoted ? "bold" : "normal"}>
                              {option.option_text}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {option.votes_count || 0} votos ({percentage}%)
                            </Text>
                          </HStack>
                          
                          <Box position="relative">
                            <Progress 
                              value={percentage} 
                              colorScheme={hasVoted ? "blue" : "gray"}
                              size="sm"
                              bg="gray.100"
                              borderRadius="full"
                            />
                            {canVote && (
                              <Box
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                cursor="pointer"
                                onClick={() => handleVote(poll.id, option.id)}
                                bg={hasVoted ? "blue.500" : "transparent"}
                                opacity={hasVoted ? 0.1 : 0}
                                _hover={{ opacity: 0.1, bg: "blue.500" }}
                                transition="all 0.2s"
                                borderRadius="full"
                              />
                            )}
                          </Box>
                        </Box>
                      );
                    })}

                    <Divider borderColor="gray.200" />

                    <HStack justify="space-between" w="full">
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.500">
                          Total: {totalVotes} votos
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Por: {poll.users?.name || 'Usuário desconhecido'}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(poll.created_at).toLocaleDateString('pt-BR')}
                        </Text>
                      </VStack>

                      <HStack>
                        <IconButton
                          icon={<ViewIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          borderRadius="full"
                          onClick={() => viewPollDetails(poll)}
                          aria-label="Ver detalhes"
                        />
                        
                        {userProfile?.role !== 'user' && (isAdmin() || poll.author_id === user.id) && (
                          <>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="orange"
                              variant="outline"
                              borderRadius="full"
                              onClick={() => handleEdit(poll)}
                              aria-label="Editar enquete"
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              borderRadius="full"
                              onClick={() => openDeleteDialog(poll.id)}
                              aria-label="Excluir enquete"
                            />
                          </>
                        )}
                      </HStack>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            );
          })
        )}
      </Grid>

      {/* Modal para criar/editar enquete */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {editingPoll ? 'Editar Enquete' : 'Nova Enquete'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Pergunta</FormLabel>
                  <Input
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    placeholder="Digite a pergunta da enquete"
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

                <FormControl>
                  <FormLabel>Data de Expiração</FormLabel>
                  <Input
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData({...formData, ends_at: e.target.value})}
                  />
                </FormControl>

                <FormControl>
                  <HStack justify="space-between">
                    <FormLabel mb={0}>Enquete Ativa</FormLabel>
                    <Switch
                      isChecked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                  </HStack>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Opções</FormLabel>
                  <VStack spacing={2}>
                    {formData.options.map((option, index) => (
                      <HStack key={index} w="full">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Opção ${index + 1}`}
                        />
                        {formData.options.length > 2 && (
                          <IconButton
                            icon={<CloseIcon />}
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={() => removeOption(index)}
                            aria-label="Remover opção"
                          />
                        )}
                      </HStack>
                    ))}
                    <Button
                      leftIcon={<AddIcon />}
                      size="sm"
                      variant="outline"
                      onClick={addOption}
                      w="full"
                    >
                      Adicionar Opção
                    </Button>
                  </VStack>
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
                {editingPoll ? 'Atualizar' : 'Criar'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Modal para ver detalhes da enquete */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhes da Enquete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPoll && (
              <VStack align="start" spacing={4}>
                <Heading size="md">{selectedPoll.question}</Heading>
                
                {selectedPoll.description && (
                  <Text color="gray.600">{selectedPoll.description}</Text>
                )}

                <HStack>
                  <Badge colorScheme={selectedPoll.active ? "green" : "red"}>
                    {selectedPoll.active ? "Ativa" : "Inativa"}
                  </Badge>
                  {isPollExpired(selectedPoll) && (
                    <Badge colorScheme="orange">Expirada</Badge>
                  )}
                </HStack>

                <Divider />

                <Text fontWeight="bold">Resultados:</Text>
                
                {selectedPoll.poll_options?.map((option) => {
                  const totalVotes = getTotalVotes(selectedPoll);
                  const percentage = getVotePercentage(option, totalVotes);

                  return (
                    <Box key={option.id} w="full">
                      <HStack justify="space-between" mb={2}>
                        <Text>{option.option_text}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {option.votes_count || 0} votos ({percentage}%)
                        </Text>
                      </HStack>
                      <Progress value={percentage} colorScheme="blue" size="sm" />
                    </Box>
                  );
                })}

                <Divider />

                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">
                    <strong>Total de votos:</strong> {getTotalVotes(selectedPoll)}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    <strong>Criado por:</strong> {selectedPoll.users?.name || 'Usuário desconhecido'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    <strong>Data de criação:</strong> {new Date(selectedPoll.created_at).toLocaleString('pt-BR')}
                  </Text>
                  {selectedPoll.ends_at && (
                    <Text fontSize="sm" color="gray.500">
                      <strong>Expira em:</strong> {new Date(selectedPoll.ends_at).toLocaleString('pt-BR')}
                    </Text>
                  )}
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
              Excluir Enquete
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir esta enquete? Esta ação não pode ser desfeita e todos os votos serão perdidos.
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

export default Polls;