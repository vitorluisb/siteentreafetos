import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chatbot.css';

// Import do favicon
import entreafetosIcon from '../assets/logo/entreafetosfavicon.png';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Números reais do WhatsApp das unidades
  const units = [
    {
      id: 'guarabira1',
      name: 'Guarabira 1',
      address: 'Centro de Guarabira',
      whatsapp: '5583986102718'
    },
    {
      id: 'guarabira2',
      name: 'Guarabira 2', 
      address: 'Novo Horizonte',
      whatsapp: '5583986102718'
    },
    {
      id: 'solanea',
      name: 'Solânea',
      address: 'Centro de Solânea',
      whatsapp: '5583986102718'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage('Olá! 😊 Sou a assistente virtual da Clínica Entre Afetos.');
        setTimeout(() => {
          addBotMessage('Estou aqui para conectá-lo com a unidade mais próxima de você!');
          setTimeout(() => {
            addBotMessage('Qual unidade você gostaria de entrar em contato?');
            setCurrentStep('unit-selection');
          }, 1500);
        }, 1500);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, Math.random() * 1000 + 800); // Tempo variável para parecer mais natural
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleUnitSelection = (unit) => {
    setSelectedUnit(unit);
    addUserMessage(`📍 ${unit.name}`);
    
    setTimeout(() => {
      addBotMessage(`Excelente escolha! ${unit.name} tem uma equipe incrível! 🏥✨`);
      setTimeout(() => {
        addBotMessage('Para conectá-lo com nossa equipe, preciso de algumas informações básicas:');
        setCurrentStep('form');
      }, 1800);
    }, 600);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      addBotMessage('Ops! 😅 Preciso do seu nome para que nossa equipe possa atendê-lo adequadamente.');
      return false;
    }
    if (formData.name.trim().length < 2) {
      addBotMessage('Por favor, digite seu nome completo para um atendimento personalizado! 😊');
      return false;
    }
    if (!formData.message.trim()) {
      addBotMessage('Não esqueça de nos contar como podemos ajudá-lo! Quanto mais detalhes, melhor será nosso atendimento! 💬');
      return false;
    }
    if (formData.message.trim().length < 10) {
      addBotMessage('Que tal nos contar um pouquinho mais sobre o que você precisa? Isso nos ajuda muito! 😊');
      return false;
    }
    return true;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;

    const userSummary = `✅ Nome: ${formData.name}${formData.phone ? `\n📱 Telefone: ${formData.phone}` : ''}\n💬 Mensagem: ${formData.message}`;
    addUserMessage(userSummary);
    
    setTimeout(() => {
      addBotMessage(`Perfeito, ${formData.name.split(' ')[0]}! 🎉`);
      setTimeout(() => {
        addBotMessage(`Conectando você diretamente com nossa equipe da ${selectedUnit.name} pelo WhatsApp...`);
        setTimeout(() => {
          // Redirecionar diretamente para o WhatsApp
          handleWhatsAppRedirect();
        }, 1500);
      }, 1200);
    }, 800);
  };

  const handleWhatsAppRedirect = () => {
    console.log('🔍 DEBUG: Iniciando handleWhatsAppRedirect');
    console.log('🔍 DEBUG: selectedUnit:', selectedUnit);
    console.log('🔍 DEBUG: formData:', formData);
    
    // Validar se a unidade foi selecionada
    if (!selectedUnit) {
      console.log('❌ DEBUG: Unidade não selecionada');
      addBotMessage('❌ Erro: Unidade não selecionada. Tente novamente.');
      setCurrentStep('unit-selection');
      return;
    }

    // Validar dados obrigatórios
    if (!formData.name || formData.name.trim().length < 2) {
      console.log('❌ DEBUG: Nome inválido:', formData.name);
      addBotMessage('❌ Erro: Nome inválido. Tente novamente.');
      setCurrentStep('form');
      return;
    }

    if (!formData.message || formData.message.trim().length < 5) {
      console.log('❌ DEBUG: Mensagem muito curta:', formData.message);
      addBotMessage('❌ Erro: Mensagem muito curta. Tente novamente.');
      setCurrentStep('form');
      return;
    }

    // Números de WhatsApp para cada unidade (mesmo da página de contato)
    const whatsappNumbers = {
      'guarabira1': '5583986102718', // Guarabira Unidade 1
      'guarabira2': '5583986102718', // Guarabira Unidade 2
      'solanea': '5583986102718'     // Solânea
    };

    // Formatear a mensagem (mesmo formato da página de contato)
    const message = `Olá! Meu nome é ${formData.name.trim()}.
Telefone: ${formData.phone || 'Não informado'}

${formData.message.trim()}

Enviado através do site da Clínica Entre Afetos.`;

    // Obter o número correto baseado na unidade selecionada
    const phoneNumber = whatsappNumbers[selectedUnit.id];
    
    console.log('🔍 DEBUG: phoneNumber:', phoneNumber);
    console.log('🔍 DEBUG: message:', message);
    
    // Criar URL do WhatsApp (mesmo método da página de contato)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    console.log('🔍 DEBUG: whatsappUrl:', whatsappUrl);
    console.log('🔍 DEBUG: Tentando abrir WhatsApp...');
    
    // Redirecionar para WhatsApp (mesmo método da página de contato)
    try {
      const result = window.open(whatsappUrl, '_blank');
      console.log('🔍 DEBUG: window.open result:', result);
      
      if (!result) {
        console.log('❌ DEBUG: window.open foi bloqueado pelo navegador');
        addBotMessage('❌ O popup foi bloqueado pelo navegador. Por favor, permita popups para este site e tente novamente.');
        return;
      }
      
      console.log('✅ DEBUG: WhatsApp aberto com sucesso');
    } catch (error) {
      console.error('❌ DEBUG: Erro ao abrir WhatsApp:', error);
      addBotMessage('❌ Erro ao abrir WhatsApp. Tente novamente.');
      return;
    }
    
    // Mostrar mensagem de confirmação e botão para nova conversa
    setTimeout(() => {
      addBotMessage('✅ Redirecionamento realizado! Se precisar de mais alguma coisa, clique no botão abaixo:');
      setCurrentStep('completed');
    }, 1000);
  };



  const resetChat = () => {
    setMessages([]);
    setCurrentStep('greeting');
    setSelectedUnit(null);
    setFormData({ name: '', phone: '', message: '' });
    setIsTyping(false);
    
    setTimeout(() => {
      addBotMessage('Olá novamente! 😊 Pronto para uma nova conversa!');
      setTimeout(() => {
        addBotMessage('Qual unidade você gostaria de entrar em contato?');
        setCurrentStep('unit-selection');
      }, 1500);
    }, 500);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset notification when opening
      localStorage.setItem('chatbot-visited', 'true');
    }
  };

  // Check if user has visited chatbot before
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('chatbot-visited');
    setHasVisited(visited === 'true');
  }, []);

  return (
    <>
      {/* Floating Toggle Button */}
      <div 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        role="button"
        tabIndex={0}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleChat();
          }
        }}
      >
        {!isOpen && !hasVisited && <div className="notification-badge">!</div>}
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <div className="whatsapp-button-content">
            <svg viewBox="0 0 24 24" fill="currentColor" className="whatsapp-icon">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
            <span className="whatsapp-text">Agenda pelo WhatsApp</span>
          </div>
        )}
      </div>

      {/* Chat Container */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <img 
                src={entreafetosIcon} 
                alt="Entre Afetos" 
                className="avatar-image"
              />
            </div>
            <div className="chatbot-info">
              <h3>Assistente Virtual</h3>
              <div className="status">Online agora</div>
            </div>
            <button 
              className="chatbot-close"
              onClick={toggleChat}
              aria-label="Fechar chat"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">{message.text}</div>
                <div className="message-time">{message.timestamp}</div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-content typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Unit Selection */}
            {currentStep === 'unit-selection' && !isTyping && (
              <div className="unit-selection">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className="unit-button"
                    onClick={() => handleUnitSelection(unit)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleUnitSelection(unit);
                      }
                    }}
                  >
                    <div className="unit-name">📍 {unit.name}</div>
                    <div className="unit-address">{unit.address}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Form */}
            {currentStep === 'form' && !isTyping && (
              <div className="chatbot-form">
                <div className="form-group">
                  <label htmlFor="name">👤 Nome completo *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite seu nome completo"
                    maxLength={50}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">📱 Telefone (opcional)</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(83) 98610-2718"
                    maxLength={15}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">💬 Como podemos ajudá-lo? *</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Conte-nos sobre sua necessidade, dúvida ou interesse..."
                    rows="4"
                    maxLength={500}
                  />
                  <small style={{color: '#666', fontSize: '12px'}}>
                    {formData.message.length}/500 caracteres
                  </small>
                </div>
                <button 
                  className="submit-button"
                  onClick={handleFormSubmit}
                  disabled={!formData.name.trim() || !formData.message.trim()}
                >
                  🚀 Quero falar com a clínica!
                </button>
              </div>
            )}

            {/* Completed Section */}
            {currentStep === 'completed' && !isTyping && (
              <div className="completed-section">
                <button 
                  className="reset-button"
                  onClick={resetChat}
                >
                  🔄 Iniciar nova conversa
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;