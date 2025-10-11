import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/PublicationArticle.css';

const articles = [
  {
    slug: 'isso-e-birra-sera-mesmo',
    title: '"Isso é birra!" Será mesmo? 😡',
    date: '2025-10-04',
    author: 'Equipe Entre Afetos',
    tag: 'Dicas para Pais',
    cover: '/publicacoes/birra.png',
    showImage: true,
    content: [
      {
        type: 'paragraph',
        text: 'Entenda o que pode estar por trás do comportamento infantil e como ajudar seu filho a lidar com as emoções.'
      },
      {
        type: 'paragraph',
        text: 'É comum, em momentos de crise, ouvir alguém dizer: "Isso é birra!" Mas será que é mesmo?'
      },
      {
        type: 'paragraph',
        text: 'Na maioria das vezes, aquilo que chamamos de "birra" pode ser um pedido de ajuda emocional — uma forma que crianças e adolescentes encontram para expressar sentimentos que ainda não sabem nomear ou controlar.'
      },
      {
        type: 'callout',
        icon: '💛',
        title: 'O que está por trás da "birra"?',
        text: 'Nem sempre o comportamento desafiador é sinal de desobediência ou falta de limites. Muitas vezes, ele reflete dificuldades emocionais ou de desenvolvimento.'
      },
      {
        type: 'list-item',
        title: 'Imaturidade emocional',
        text: 'A criança ainda está aprendendo a lidar com frustrações e limites.'
      },
      {
        type: 'list-item',
        title: 'Falta de vivências',
        text: 'Situações novas podem gerar medo, insegurança e reações intensas.'
      },
      {
        type: 'list-item',
        title: 'Sobrecarga emocional',
        text: 'O cansaço, a ansiedade e o estresse influenciam nas respostas comportamentais.'
      },
      {
        type: 'list-item',
        title: 'Dificuldades de comunicação',
        text: 'Quando não há recursos para expressar o que se sente, o comportamento se torna a linguagem.'
      },
      {
        type: 'paragraph',
        text: 'Essas reações, que costumam ser rotuladas como "manha" ou "birra", são na verdade sinais de que algo precisa ser compreendido e acolhido.'
      },
      {
        type: 'callout',
        icon: '🌿',
        title: 'Por que acolher é mais eficaz do que punir?',
        text: 'Quando o adulto reage à birra com irritação ou punição, a criança aprende a reprimir emoções, mas não a lidar com elas. Quando há acolhimento, empatia e escuta, ela entende que é possível sentir raiva, medo ou frustração — e aprender a expressar isso de forma mais saudável.'
      },
      {
        type: 'callout',
        icon: '👉',
        title: 'Dicas práticas para pais e cuidadores',
        text: 'Respire fundo antes de reagir: você é o modelo de calma para seu filho. Reconheça o sentimento: "Entendo que você está bravo porque queria continuar brincando." Mantenha o limite com empatia: firmeza e afeto podem coexistir. Reforce o vínculo com momentos positivos e acolhimento emocional.'
      },
      {
        type: 'paragraph',
        text: 'Com o tempo e o apoio adequado, a criança desenvolve equilíbrio emocional, empatia e autoconfiança — habilidades fundamentais para uma vida saudável.'
      },
      {
        type: 'callout',
        icon: '🌸',
        title: 'Como a Entre Afetos pode ajudar?',
        text: 'Na Entre Afetos, acreditamos que todo comportamento comunica uma necessidade. Nosso trabalho é ajudar famílias a compreender o que está por trás dessas reações, promovendo saúde emocional, fortalecimento de vínculos e desenvolvimento integral de crianças e adolescentes. Contamos com uma equipe multidisciplinar pronta para acolher e orientar cada etapa do crescimento — porque compreender emoções é o primeiro passo para fortalecê-las.'
      },
      {
        type: 'cta',
        icon: '🌼',
        text: 'Por trás da "birra", há sentimentos que precisam ser vistos, compreendidos e validados. Quando os adultos acolhem com empatia, ajudam a criança a construir autoconhecimento, autonomia emocional e segurança afetiva. Com paciência, afeto e acompanhamento especializado, cada desafio pode se transformar em um aprendizado para toda a família. 💛'
      }
    ]
  },
  {
    slug: '5-sinais-dificuldades-aprendizagem',
    title: '5 sinais de que seu filho pode estar enfrentando dificuldades na aprendizagem',
    date: '2025-10-04',
    author: 'Equipe Entre Afetos',
    tag: 'Dificuldades de Aprendizagem',
    cover: '/publicacoes/5sinais.png',
    showImage: true,
    content: [
      {
        type: 'paragraph',
        text: 'Aprender é um processo único e cheio de descobertas. Cada criança tem seu próprio ritmo, mas alguns sinais podem indicar que ela está precisando de um olhar mais atento e apoio especializado.'
      },
      {
        type: 'paragraph',
        text: 'Aqui estão alguns pontos importantes que os pais e responsáveis podem observar:'
      },
      {
        type: 'list-item',
        title: '1. Dificuldade em manter a atenção',
        text: 'Se a criança se distrai facilmente ou não consegue se concentrar em atividades simples, isso pode impactar diretamente o aprendizado.'
      },
      {
        type: 'list-item',
        title: '2. Esquecimento frequente',
        text: 'Quando tarefas simples ou instruções são constantemente esquecidas, pode ser um indício de que algo está atrapalhando a assimilação de informações.'
      },
      {
        type: 'list-item',
        title: '3. Resistência em ir à escola ou fazer tarefas',
        text: 'A criança pode evitar atividades escolares por sentir frustração, medo de errar ou insegurança diante dos colegas.'
      },
      {
        type: 'list-item',
        title: '4. Baixa autoestima em relação aos estudos',
        text: 'Comentários como "sou burro" ou "não consigo aprender" refletem sentimentos de incapacidade e exigem acolhimento imediato.'
      },
      {
        type: 'list-item',
        title: '5. Dificuldades específicas em leitura, escrita ou cálculos',
        text: 'Trocas de letras, dificuldade em escrever palavras simples ou problemas para compreender números também são sinais de alerta.'
      },
      {
        type: 'callout',
        icon: '💡',
        title: 'O que fazer?',
        text: 'O mais importante é oferecer apoio emocional, mostrar compreensão e buscar ajuda profissional. Psicólogos infantis e especialistas em aprendizagem podem identificar as causas e propor estratégias que respeitem o ritmo da criança.'
      },
      {
        type: 'cta',
        icon: '👉',
        text: 'Se você percebeu algum desses sinais em seu filho, saiba que não está sozinho. A equipe da Entre Afetos está aqui para acolher, orientar e ajudar sua família nesse processo de forma carinhosa e respeitosa.'
      }
    ]
  },
  {
    slug: 'integracao-sensorial-sentidos-organizados',
    title: 'Integração Sensorial: quando os sentidos se organizam, o mundo faz mais sentido',
    date: '2025-10-05',
    author: 'Equipe Entre Afetos',
    tag: 'Saúde Emocional',
    cover: '/publicacoes/sensorial.png',
    showImage: true,
    content: [
      { type: 'paragraph', text: 'Como a integração sensorial apoia atenção, aprendizagem e comportamento em crianças e adolescentes.' },
      { type: 'paragraph', text: 'Você já notou que algumas crianças se incomodam com barulhos, etiquetas de roupa ou cheiros fortes, enquanto outras parecem “não sentir” o suficiente e buscam estímulos o tempo todo? Isso se relaciona à forma como o cérebro processa informações sensoriais. Quando essa “orquestra” está afinada, a criança consegue prestar atenção, aprender, brincar e se relacionar com mais tranquilidade. Quando há desequilíbrios, surgem dificuldades de concentração, irritabilidade, agitação ou evasão de atividades.' },
      { type: 'callout', icon: '🧠', title: 'O que é Integração Sensorial?', text: 'É a capacidade do cérebro de organizar e dar significado aos estímulos que chegam pelo tato, visão, audição, olfato, paladar, movimento (vestibular) e propriocepção (consciência do corpo). Quando esse processamento funciona bem, a criança responde de forma adequada ao ambiente; quando há desafios, o cotidiano pode se tornar confuso e desgastante.' },
      { type: 'callout', icon: '👀', title: 'Sinais que merecem atenção', text: 'Alguns sinais do dia a dia podem indicar que a criança precisa de suporte para organizar seus sentidos.' },
      { type: 'list-item', title: 'Incômodo com roupas, texturas ou sons do dia a dia', text: 'Rejeição a etiquetas, tecidos, ruídos ambientais ou cheiros fortes.' },
      { type: 'list-item', title: 'Busca por estímulos intensos', text: 'Pular, bater, morder objetos ou buscar pressão para “se regular”.' },
      { type: 'list-item', title: 'Dificuldade para manter atenção e concluir tarefas', text: 'Agitação, inquietação e evasão de atividades que exigem foco.' },
      { type: 'list-item', title: 'Evita ou busca movimento o tempo todo', text: 'Medo de balanço, escorregador ou, ao contrário, procura movimento constante.' },
      { type: 'list-item', title: 'Resistência a cuidados pessoais', text: 'Cortar unhas/cabelos, escovar dentes ou experimentar alimentos pode ser desafiador.' },
      { type: 'list-item', title: 'Dificuldade de coordenação motora e planejamento', text: 'Atividades simples podem exigir esforço extra para organizar ações e sequências.' },
      { type: 'callout', icon: '👪', title: 'Dicas para pais e cuidadores', text: 'Acompanhe e ajuste o ambiente para reduzir sobrecarga sensorial e favorecer a autorregulação.' },
      { type: 'list-item', title: 'Observe e registre', text: 'Anote quando e onde os desafios aparecem mais para identificar padrões.' },
      { type: 'list-item', title: 'Adapte o ambiente', text: 'Use fones abafadores em locais ruidosos, roupas confortáveis e um cantinho da calma.' },
      { type: 'list-item', title: 'Crie rotinas previsíveis', text: 'Avisos e transições antecipadas ajudam a reduzir a ansiedade e a sobrecarga.' },
      { type: 'list-item', title: 'Inclua “pausas regulatórias”', text: 'Brincadeiras de movimento, pressão profunda (abraços de urso), respiração e alongamentos.' },
      { type: 'list-item', title: 'Respeite o tempo da criança', text: 'Avanços graduais são mais sustentáveis do que exposições bruscas.' },
      { type: 'callout', icon: '🤝', title: 'Como a Entre Afetos pode ajudar', text: 'Realizamos avaliação e intervenções baseadas em Integração Sensorial em ambiente lúdico e seguro, ajustando a quantidade e o tipo de estímulos de que cada criança precisa.' },
      { type: 'list-item', title: 'Melhora da atenção e da autorregulação', text: 'A criança aprende estratégias para organizar respostas ao ambiente.' },
      { type: 'list-item', title: 'Organização do comportamento', text: 'Redução de irritabilidade, agitação e evasão de atividades.' },
      { type: 'list-item', title: 'Desenvolvimento da coordenação e planejamento', text: 'Aprimora habilidades motoras e a sequência de ações cotidianas.' },
      { type: 'list-item', title: 'Maior participação escolar e social', text: 'Mais conforto e autonomia em tarefas e interações com colegas e professores.' },
      { type: 'list-item', title: 'Bem-estar emocional e autonomia', text: 'Fortalece autoestima, confiança e sensação de segurança.' },
      { type: 'paragraph', text: 'Quando os sentidos se organizam, o mundo faz mais sentido. Com orientação adequada e estratégias personalizadas, é possível transformar desafios sensoriais em oportunidades de aprendizagem, confiança e participação ativa no dia a dia.' },
      { type: 'cta', icon: '📲', text: 'Quer entender melhor como apoiar seu filho? Fale conosco e agende uma avaliação baseada em Integração Sensorial.' }
    ]
  },
  {
    slug: 'dificuldades-na-escola-ainda-da-tempo-de-superar',
    title: 'Dificuldades na escola? Ainda dá tempo de superar isso!',
    date: '2025-10-05',
    author: 'Equipe Entre Afetos',
    tag: 'Dificuldades de Aprendizagem',
    cover: '/publicacoes/dificuldadeescolar.png',
    showImage: true,
    content: [
      { type: 'paragraph', text: 'Como identificar os sinais, apoiar em casa e buscar o suporte certo para o aprendizado.' },
      { type: 'paragraph', text: 'Nem toda dificuldade escolar é “falta de esforço”. Muitas vezes, por trás das notas baixas e da desmotivação existem fatores como desafios de atenção, organização, linguagem, leitura, escrita, matemática, processamento sensorial, ansiedade de desempenho ou lacunas de base. A boa notícia é que, com o apoio certo, é possível avançar — e recuperar a confiança.' },
      { type: 'callout', icon: '👀', title: 'Sinais que merecem atenção', text: 'Observe alguns indicadores que podem sugerir a necessidade de suporte direcionado.' },
      { type: 'list-item', title: 'Queda repentina no rendimento ou resistência para ir à escola', text: 'Mudanças bruscas de desempenho, desmotivação e evitação de tarefas escolares.' },
      { type: 'list-item', title: 'Trocas de letras/sons, leitura lenta ou compreensão limitada do texto', text: 'Dificuldade em decodificar, reconhecer padrões e compreender conteúdos de leitura.' },
      { type: 'list-item', title: 'Dificuldade em copiar da lousa, organizar o caderno e seguir instruções', text: 'Impacto em planejamento, organização e execução de atividades.' },
      { type: 'list-item', title: 'Problemas persistentes em matemática', text: 'Desafios em raciocínio, fatos básicos e resolução de problemas.' },
      { type: 'list-item', title: 'Distração fácil, inquietação ou “travamento” em testes', text: 'Oscilações de atenção e ansiedade de desempenho podem impedir a demonstração do conhecimento.' },
      { type: 'list-item', title: 'Sintomas físicos antes das aulas', text: 'Dor de barriga/cefaleia, choro ou evitação podem sinalizar sofrimento.' },
      { type: 'callout', icon: '👪', title: 'Dicas para pais e cuidadores', text: 'Apoie em casa com rotinas claras, recursos adequados e comunicação acolhedora.' },
      { type: 'list-item', title: 'Construa uma rotina previsível de estudo', text: 'Inclua pausas curtas, objetivos claros e ambiente favorável.' },
      { type: 'list-item', title: 'Transforme tarefas em passos menores e celebre microconquistas', text: 'Metas graduais promovem motivação e reduzem frustrações.' },
      { type: 'list-item', title: 'Use recursos multisensoriais', text: 'Leitura em voz alta, jogos educativos e materiais concretos ajudam na compreensão.' },
      { type: 'list-item', title: 'Mantenha comunicação aberta com a escola', text: 'Alinhe estratégias com professores e coordenação.' },
      { type: 'list-item', title: 'Valorize o esforço, não apenas o resultado', text: 'Reforce autonomia, resiliência e autoconfiança.' },
      { type: 'callout', icon: '🌸', title: 'Como a Entre Afetos apoia seu filho', text: 'Realizamos avaliação e intervenções personalizadas com foco nas necessidades do estudante.' },
      { type: 'list-item', title: 'Alfabetização e compreensão leitora', text: 'Aprimoramos decodificação, fluência e compreensão de textos.' },
      { type: 'list-item', title: 'Escrita', text: 'Ortografia, produção textual e organização do caderno.' },
      { type: 'list-item', title: 'Raciocínio lógico e matemática funcional', text: 'Construção de base sólida e aplicação prática.' },
      { type: 'list-item', title: 'Funções executivas', text: 'Atenção, planejamento, memória de trabalho e organização para estudar melhor.' },
      { type: 'list-item', title: 'Regulação emocional e autoconfiança', text: 'Estratégias para enfrentar provas e tarefas com mais segurança.' },
      { type: 'paragraph', text: 'Trabalhamos de forma lúdica e personalizada, em parceria com a família e a escola, para construir estratégias práticas que façam sentido no cotidiano do estudante. O objetivo é que ele avance no conteúdo, recupere a autoestima acadêmica e sinta prazer em aprender.' },
      { type: 'paragraph', text: 'Os desafios da escola podem ser superados com o apoio certo. Quanto antes identificamos o que está por trás das dificuldades e ajustamos as intervenções, mais rápido o estudante retoma o caminho do aprendizado com leveza e segurança.' },
      { type: 'cta', icon: '📲', text: 'Quer apoio para o estudo do seu filho? Fale conosco e agende uma avaliação.' }
    ]
  },
  {
    slug: 'falar-tarde-nem-sempre-e-so-uma-fase',
    title: 'Falar tarde nem sempre é só uma fase',
    date: '2025-10-07',
    author: 'Equipe Entre Afetos',
    tag: 'Dicas para Pais',
    cover: '/publicacoes/fala.png',
    showImage: true,
    content: [
      { type: 'paragraph', text: 'Quando buscar ajuda para o desenvolvimento da fala e da linguagem.' },
      { type: 'paragraph', text: 'Você notou que seu filho fala pouco, troca muitos sons, não forma frases ou parece não compreender o que é dito? Em alguns casos, o "vai desenvolver no tempo dele" pode atrasar intervenções importantes. Falar tarde nem sempre é só uma fase — pode ser um sinal de que a criança precisa de acompanhamento para avançar com segurança.' },
      { type: 'callout', icon: '🚨', title: 'Sinais de alerta que merecem atenção', text: 'Alguns comportamentos podem indicar a necessidade de uma avaliação profissional para entender o desenvolvimento da fala e linguagem.' },
      { type: 'list-item', title: 'Pouco interesse em imitar sons, gestos ou palavras', text: 'A imitação é fundamental para o aprendizado da comunicação. Quando a criança não demonstra esse interesse, pode sinalizar dificuldades.' },
      { type: 'list-item', title: 'Dificuldade para compreender instruções simples do dia a dia', text: 'Se a criança não responde adequadamente a comandos básicos ou parece não entender o que é dito.' },
      { type: 'list-item', title: 'Vocabulário reduzido para a idade e frases curtinhas ou inexistentes', text: 'Quando o repertório de palavras está abaixo do esperado ou a criança não consegue formar frases.' },
      { type: 'list-item', title: 'Trocas e omissões de sons que dificultam o entendimento', text: 'Substituições constantes de sons ou omissão de partes das palavras que prejudicam a comunicação.' },
      { type: 'list-item', title: 'Frustração, choro ou agitação ao tentar se comunicar', text: 'A dificuldade de se expressar pode gerar sofrimento emocional na criança.' },
      { type: 'list-item', title: 'Atrasos associados: atenção, interação social, brincadeira simbólica, alimentação seletiva', text: 'Outros aspectos do desenvolvimento também podem estar impactados.' },
      { type: 'paragraph', text: 'Esses sinais não significam "problema para sempre". Eles indicam que a criança pode se beneficiar de uma avaliação para entender o que está por trás do atraso e traçar um plano de cuidado.' },
      { type: 'callout', icon: '🌱', title: 'Por que buscar ajuda cedo faz diferença?', text: 'A intervenção precoce potencializa conexões neurais, amplia o repertório de comunicação e reduz impactos na escola, na socialização e na autoestima.' },
      { type: 'list-item', title: 'Desenvolve compreensão e expressão de forma progressiva', text: 'Com o suporte adequado, a criança amplia suas habilidades comunicativas gradualmente.' },
      { type: 'list-item', title: 'Ganha confiança para se comunicar em diferentes contextos', text: 'A segurança na comunicação se reflete em todas as áreas da vida.' },
      { type: 'list-item', title: 'Melhora a interação com família, colegas e professores', text: 'A comunicação efetiva fortalece vínculos e facilita o aprendizado.' },
      { type: 'list-item', title: 'Avança no aprendizado de leitura e escrita posteriormente', text: 'A base de linguagem oral é fundamental para a alfabetização.' },
      { type: 'callout', icon: '💙', title: 'Como a Entre Afetos pode ajudar', text: 'Na Clínica Entre Afetos, unimos acolhimento, escuta e técnica para apoiar o desenvolvimento infantil.' },
      { type: 'list-item', title: 'Avaliação fonoaudiológica e do desenvolvimento global', text: 'Análise completa para identificar as necessidades específicas de cada criança.' },
      { type: 'list-item', title: 'Plano terapêutico individualizado, lúdico e funcional', text: 'Intervenções personalizadas que respeitam o ritmo e os interesses da criança.' },
      { type: 'list-item', title: 'Orientação aos pais para estimular a fala em casa', text: 'Estratégias simples e eficazes para aplicar nas rotinas diárias.' },
      { type: 'list-item', title: 'Trabalho integrado com escola e outros profissionais', text: 'Parceria multidisciplinar quando necessário para resultados mais efetivos.' },
      { type: 'callout', icon: '🧠', title: 'Quanto mais cedo o acompanhamento, maiores as chances de um desenvolvimento saudável e confiante.', text: '' },
      { type: 'callout', icon: '👨‍👩‍👧', title: 'Dicas práticas para estimular a fala em casa', text: 'Pequenas mudanças na rotina podem fazer grande diferença no desenvolvimento da linguagem.' },
      { type: 'list-item', title: 'Narre o cotidiano', text: 'Descreva ações e objetos enquanto interage: "Olha, vou pegar a bola vermelha!".' },
      { type: 'list-item', title: 'Dê escolhas', text: 'Convide a criança a responder: "Quer água ou suco?".' },
      { type: 'list-item', title: 'Espere e valorize tentativas', text: 'Olhe nos olhos, aguarde a resposta e celebre cada avanço, por menor que seja.' },
      { type: 'list-item', title: 'Brinque de faz-de-conta, músicas com gestos e jogos de turno', text: 'Atividades de "minha vez/sua vez" ensinam turnos conversacionais.' },
      { type: 'list-item', title: 'Reduza telas e aumente conversas olho no olho', text: 'A interação humana é insubstituível para o desenvolvimento da linguagem.' },
      { type: 'paragraph', text: 'Se você percebe atraso na fala, dificuldade no aprendizado ou outros sinais de atraso no desenvolvimento, não precisa enfrentar isso sozinho. Buscar uma avaliação é um gesto de cuidado — e o primeiro passo para abrir caminhos de comunicação, autonomia e bem-estar.' },
      { type: 'cta', icon: '🌸', text: 'Na Clínica Entre Afetos, somos referência em cuidado infantil com amor, escuta e técnica. Fale com nossa equipe e tire suas dúvidas. Estamos aqui para acolher você e sua família.' }
    ]
  },
  {
    slug: 'seu-filho-parece-molinho-pode-ser-hipotonia',
    title: 'Seu filho parece "molinho"? Pode ser hipotonia — e merece atenção',
    date: '2025-10-07',
    author: 'Equipe Entre Afetos',
    tag: 'Dicas para Pais',
    cover: '/publicacoes/molinho.png',
    showImage: true,
    content: [
      { type: 'paragraph', text: 'Como identificar sinais, quando buscar avaliação e o que ajuda no dia a dia.' },
      { type: 'paragraph', text: 'Alguns bebês e crianças parecem mais "molininhos", cansam rápido ou têm dificuldade para sustentar o corpinho. Esse quadro pode estar relacionado à hipotonia, que é a redução do tônus muscular. Identificar cedo faz toda a diferença para o desenvolvimento motor, a autonomia e a participação nas atividades do dia a dia.' },
      { type: 'callout', icon: '💪', title: 'O que é hipotonia?', text: 'É quando os músculos apresentam menor resistência ao movimento e ao alongamento. Isso não é um diagnóstico fechado por si só, mas um sinal clínico que pode aparecer em diferentes condições e níveis de intensidade.' },
      { type: 'callout', icon: '👀', title: 'Sinais de alerta que merecem observação', text: 'A combinação de sinais, principalmente desde os primeiros meses, indica que vale buscar uma avaliação.' },
      { type: 'list-item', title: 'Postura mais "mole" e dificuldade para manter a cabeça erguida', text: 'Bebês com hipotonia podem apresentar dificuldade para sustentar a cabeça e manter posturas.' },
      { type: 'list-item', title: 'Atraso em marcos motores: rolar, sentar, engatinhar ou andar', text: 'O desenvolvimento motor pode estar atrasado em relação ao esperado para a idade.' },
      { type: 'list-item', title: 'Cansaço fácil, baixo vigor ao sugar, mastigar ou falar', text: 'A hipotonia pode afetar também a musculatura orofacial, impactando alimentação e fala.' },
      { type: 'list-item', title: 'Questões de coordenação: pegar objetos, subir degraus, correr, pular', text: 'Atividades que exigem força e coordenação podem ser desafiadoras.' },
      { type: 'list-item', title: 'Hipermobilidade (articulações muito "soltas") ou quedas frequentes', text: 'As articulações podem apresentar maior flexibilidade e instabilidade.' },
      { type: 'list-item', title: 'Dificuldade para manter a postura sentada em atividades escolares', text: 'Sentar-se adequadamente à mesa pode exigir esforço extra e causar fadiga.' },
      { type: 'callout', icon: '⚠️', title: 'Importante', text: 'Cada criança tem seu tempo — mas a combinação de sinais, principalmente desde os primeiros meses, indica que vale buscar uma avaliação.' },
      { type: 'callout', icon: '🌱', title: 'Por que a intervenção precoce ajuda tanto?', text: 'Quanto antes o cuidado começa, maior a chance de resultados positivos.' },
      { type: 'list-item', title: 'Fortalecer o tônus e a estabilidade postural', text: 'Exercícios específicos ajudam a desenvolver força muscular adequada.' },
      { type: 'list-item', title: 'Ampliar a coordenação e o equilíbrio', text: 'Melhora nas habilidades motoras grossas e finas.' },
      { type: 'list-item', title: 'Prevenir compensações e sobrecarga nas articulações', text: 'Evita que o corpo desenvolva padrões compensatórios prejudiciais.' },
      { type: 'list-item', title: 'Favorecer alimentação, fala e respiração quando há impacto orofacial', text: 'O trabalho muscular beneficia múltiplas funções.' },
      { type: 'list-item', title: 'Ganhar autonomia nas rotinas (brincar, vestir-se, participar da escola)', text: 'A criança se torna mais independente e participativa.' },
      { type: 'callout', icon: '🏠', title: 'Dicas práticas para estimular em casa', text: 'Pequenas atividades no dia a dia podem fazer grande diferença no desenvolvimento motor.' },
      { type: 'list-item', title: 'Ofereça tempos de barriga para baixo (tummy time)', text: 'Com supervisão desde cedo para fortalecer pescoço, tronco e membros superiores.' },
      { type: 'list-item', title: 'Brincadeiras que puxem, empurrem, engatinhem, alcancem e subam', text: 'Atividades que estimulem diferentes grupos musculares de forma lúdica.' },
      { type: 'list-item', title: 'Circuitos lúdicos: almofadas, túneis, colchões, rampas baixas', text: 'Crie percursos divertidos que desafiem o equilíbrio e a força.' },
      { type: 'list-item', title: 'Atividades na água para trabalhar globalmente força e equilíbrio', text: 'A água oferece resistência natural e suporte, facilitando o movimento.' },
      { type: 'list-item', title: 'Pausas frequentes e incentivo positivo a cada conquista', text: 'Respeite o ritmo da criança e celebre os progressos.' },
      { type: 'callout', icon: '💙', title: 'Como a Entre Afetos pode apoiar sua família', text: 'Na Entre Afetos, realizamos avaliação cuidadosa e plano de intervenção personalizado, com abordagem lúdica e baseada em evidências.' },
      { type: 'paragraph', text: 'Nossa equipe (Fisioterapia, Terapia Ocupacional, Fonoaudiologia e Psicologia, quando necessário) atua para:' },
      { type: 'list-item', title: 'Fortalecimento e estabilidade de tronco e membros', text: 'Exercícios terapêuticos direcionados para ganho de tônus muscular.' },
      { type: 'list-item', title: 'Coordenação, equilíbrio e planejamento motor', text: 'Desenvolvimento de habilidades para execução de movimentos complexos.' },
      { type: 'list-item', title: 'Treino postural para atividades de casa e escola', text: 'Adaptações e estratégias para melhor desempenho nas rotinas.' },
      { type: 'list-item', title: 'Orientação à família para rotina de estímulos simples e efetivos', text: 'Capacitação dos cuidadores para continuidade do cuidado em casa.' },
      { type: 'list-item', title: 'Acompanhamento integrado com outros profissionais quando indicado', text: 'Trabalho em equipe para atender todas as necessidades da criança.' },
      { type: 'paragraph', text: 'Perceber que seu filho está "molinho" não precisa ser motivo de alarme — é um convite à observação e ao cuidado. Com orientação especializada e intervenções precoces, é possível promover força, autonomia e qualidade de vida, respeitando o ritmo e as necessidades de cada criança.' },
      { type: 'cta', icon: '📲', text: 'Notou algum destes sinais? Fale com nossa equipe e agende uma avaliação. Estamos prontos para apoiar o desenvolvimento do seu filho com todo cuidado e profissionalismo.' }
    ]
  },
  {
    slug: 'dificuldade-na-escrita-pode-ser-tdah',
    title: 'Dificuldade na escrita pode ser TDAH?',
    date: '2025-10-07',
    author: 'Equipe Entre Afetos',
    tag: 'Dificuldades de Aprendizagem',
    cover: '/publicacoes/escrita.png',
    showImage: true,
    content: [
      { type: 'paragraph', text: 'Nem todo erro na escrita é distração — entenda as causas e como ajudar.' },
      { type: 'paragraph', text: 'Quando a escrita não flui, é comum pensar em "falta de atenção". Crianças e adolescentes com TDAH podem, sim, apresentar dificuldade para organizar as ideias, manter o foco, revisar o que escreveram e concluir tarefas no tempo esperado. Mas atenção: dificuldade na escrita também pode estar relacionada a outras condições, como dislexia, disgrafia, dificuldades visuomotoras, processamento auditivo, funções executivas imaturas ou lacunas de ensino. Por isso, a avaliação correta faz toda a diferença.' },
      { type: 'callout', icon: '🚨', title: 'Sinais de alerta na escrita que merecem investigação', text: 'Vários indicadores podem apontar a necessidade de uma avaliação especializada.' },
      { type: 'list-item', title: 'Letras de tamanhos irregulares, espaçamento confuso e cansaço rápido ao escrever', text: 'Dificuldades motoras finas podem impactar a qualidade e resistência da escrita.' },
      { type: 'list-item', title: 'Escrita muito lenta, dificuldade em copiar da lousa e revisar o próprio texto', text: 'Questões de velocidade de processamento e atenção visual podem estar envolvidas.' },
      { type: 'list-item', title: 'Trocas e omissões de letras/sons, inversões, ortografia inconsistente', text: 'Pode indicar dificuldades de consciência fonológica ou processamento auditivo.' },
      { type: 'list-item', title: 'Dificuldade para planejar o texto: começar, organizar parágrafos e concluir', text: 'Funções executivas imaturas podem dificultar a estruturação do texto.' },
      { type: 'list-item', title: 'Ideias boas "na cabeça", mas pouco registro no papel', text: 'A dificuldade de transpor o pensamento para o escrito pode ter várias causas.' },
      { type: 'list-item', title: 'Evitação de atividades escritas e queda na autoestima acadêmica', text: 'A frustração repetida pode levar à recusa e ao sofrimento emocional.' },
      { type: 'callout', icon: '⚠️', title: 'Importante', text: 'Esses sinais podem indicar TDAH, mas também podem apontar para dislexia/disgrafia ou dificuldades motoras finas e visuais. O caminho é investigar com cuidado para intervir de forma precisa.' },
      { type: 'callout', icon: '🔍', title: 'Por que a avaliação multidisciplinar é essencial?', text: 'Uma abordagem integrada permite mapear onde está o obstáculo principal.' },
      { type: 'list-item', title: 'Psicologia/Neuropsicologia', text: 'Avaliação de atenção, memória de trabalho e funções executivas.' },
      { type: 'list-item', title: 'Psicopedagogia', text: 'Análise de leitura, escrita, compreensão e estratégias de estudo.' },
      { type: 'list-item', title: 'Fonoaudiologia', text: 'Investigação de consciência fonológica, linguagem oral e processamento auditivo.' },
      { type: 'list-item', title: 'Terapia Ocupacional', text: 'Avaliação de coordenação motora fina, integração sensorial e postura.' },
      { type: 'paragraph', text: 'Com esse mapa completo, o plano de intervenção torna-se efetivo e personalizado.' },
      { type: 'callout', icon: '💡', title: 'Dicas práticas para pais e estudantes', text: 'Pequenas adaptações podem fazer grande diferença no desempenho da escrita.' },
      { type: 'list-item', title: 'Quebre a tarefa em passos curtos e utilize checklists visuais', text: 'Dividir a atividade torna o processo menos sobrecarregante e mais gerenciável.' },
      { type: 'list-item', title: 'Permita rascunhos antes da versão final', text: 'Trabalhe em etapas: planejamento → escrita → revisão.' },
      { type: 'list-item', title: 'Use recursos de apoio: pautas ampliadas, guias de linha, canetas confortáveis', text: 'Materiais adaptados podem facilitar a execução motora.' },
      { type: 'list-item', title: 'Pratique consciência fonológica com jogos de rimas, sílabas e sons iniciais', text: 'Atividades lúdicas fortalecem a base da escrita correta.' },
      { type: 'list-item', title: 'Incentive tecnologia assistiva quando indicado', text: 'Ferramentas como digitação e leitura em voz alta podem ser grandes aliadas.' },
      { type: 'list-item', title: 'Valorize o conteúdo e o esforço, não apenas a "letra bonita"', text: 'Reconheça o progresso e as ideias, fortalecendo a motivação.' },
      { type: 'callout', icon: '💙', title: 'Como a Entre Afetos pode ajudar', text: 'Na Entre Afetos, realizamos avaliação completa e criamos intervenções individualizadas para escrita, leitura e organização das ideias.' },
      { type: 'paragraph', text: 'Atuamos para:' },
      { type: 'list-item', title: 'Fortalecer atenção, planejamento e revisão (funções executivas)', text: 'Desenvolvimento das habilidades cognitivas essenciais para a escrita.' },
      { type: 'list-item', title: 'Desenvolver ortografia, fluência e compreensão leitora', text: 'Trabalho específico nas bases da leitura e escrita.' },
      { type: 'list-item', title: 'Melhorar coordenação motora fina, pegada e postura para escrever', text: 'Aprimoramento dos aspectos motores e sensoriais da escrita.' },
      { type: 'list-item', title: 'Ensinar estratégias de estudo e autogestão do tempo', text: 'Ferramentas práticas para organização e autonomia escolar.' },
      { type: 'list-item', title: 'Trabalhar a confiança e reduzir a ansiedade diante de tarefas escritas', text: 'Apoio emocional para recuperar a segurança acadêmica.' },
      { type: 'paragraph', text: 'Nosso objetivo é que a criança ou adolescente escreva com mais clareza, autonomia e segurança — e volte a acreditar no próprio potencial acadêmico.' },
      { type: 'paragraph', text: 'Dificuldade na escrita não é "preguiça" e nem sempre é só TDAH. Com uma avaliação cuidadosa e apoio adequado, é possível destravar a escrita, organizar as ideias e transformar a experiência escolar.' },
      { type: 'cta', icon: '📝', text: 'Seu filho tem dificuldade na escrita? Fale com nossa equipe e descubra como podemos ajudar a transformar esse desafio em conquista.' }
    ]
  },
  {
    slug: 'sensorial-e-inverno-como-equilibrar',
    title: 'Sensorial e inverno: como equilibrar?',
    date: '2025-10-09',
    author: 'Equipe Entre Afetos',
    tag: 'Dicas para Pais',
    cover: '/publicacoes/invernosensorial.png',
    showImage: true,
    content: [
      { type: 'paragraph', text: 'O inverno chegou, mas nem tudo aquece com aconchego. Para muitas crianças e adolescentes, especialmente os neurodivergentes, o frio traz um desafio extra: o desconforto com determinadas texturas, costuras, etiquetas, lã que pinica ou mudanças bruscas de temperatura. Isso está ligado ao processamento sensorial — e não é “manha”.' },
      { type: 'callout', icon: '🌟', title: 'Respeitar os limites sensoriais também é cuidar com afeto', text: 'Quando a família entende o que incomoda e adapta o ambiente, a rotina de inverno fica mais leve, previsível e acolhedora.' },
      { type: 'callout', icon: '🧠', title: 'Por que isso acontece?', text: 'Algumas crianças têm hipersensibilidade tátil, auditiva ou térmica. O que para um adulto é “macio e quentinho”, para elas pode ser agressivo ou irritante. Essa sobrecarga sensorial pode gerar irritabilidade, choro, recusa de roupas e até dificuldades para dormir.' },
      { type: 'callout', icon: '⚠️', title: 'Sinais de desconforto sensorial no frio', text: 'Observe comportamentos que indicam incômodo com roupas, texturas e temperatura.' },
      { type: 'list-item', title: 'Recusa a usar casacos, meias, gorros ou cobertores específicos', text: 'Preferência por poucas camadas e tecidos bem específicos.' },
      { type: 'list-item', title: 'Coceira, agitação ou choro ao vestir tecidos ásperos (como certas lãs)', text: 'Rejeição a costuras, etiquetas e elásticos apertados.' },
      { type: 'list-item', title: 'Dificuldade para adormecer por causa do toque do pijama/coberta', text: 'O contato pode ser percebido como invasivo ou desconfortável.' },
      { type: 'list-item', title: 'Busca de rotinas rígidas para se sentir seguro', text: 'Mesma roupa, mesma manta, mesmas sequências ao vestir.' },
      { type: 'callout', icon: '💡', title: 'Dicas práticas para pais e cuidadores', text: 'Ajustes simples tornam o inverno mais confortável e previsível.' },
      { type: 'list-item', title: 'Priorize tecidos macios e respiráveis', text: 'Algodão, malha, plush suave e fleece antialérgico.' },
      { type: 'list-item', title: 'Use camadas finas em vez de uma peça grossa', text: 'Permite ajustar a temperatura sem sobrecarga sensorial.' },
      { type: 'list-item', title: 'Retire etiquetas e escolha costuras discretas', text: 'Prefira modelagens sem elástico apertado.' },
      { type: 'list-item', title: 'Deixe a criança participar da escolha das roupas', text: 'Teste texturas com antecedência e respeite preferências.' },
      { type: 'list-item', title: 'Aqueça o ambiente e as peças antes do banho/sono', text: 'Evite mudanças térmicas bruscas.' },
      { type: 'list-item', title: 'Crie um “kit conforto”', text: 'Manta preferida, roupa sensorialmente neutra, meia macia.' },
      { type: 'list-item', title: 'Estabeleça rotina previsível de vestir', text: 'Use passos visuais e tempo para adaptação.' },
      { type: 'list-item', title: 'Use estratégias de regulação', text: 'Respiração, pressão profunda/abraços de urso e compressão suave.' },
      { type: 'list-item', title: 'Combine com a escola as peças toleradas', text: 'Alinhe estratégias para dias muito frios.' },
      { type: 'callout', icon: '🩺', title: 'Quando buscar avaliação', text: 'Se o desconforto interfere no sono, na ida à escola ou nas atividades diárias, busque avaliação com Terapia Ocupacional (Integração Sensorial) para entender o perfil sensorial e criar um plano de apoio individualizado.' },
      { type: 'callout', icon: '💙', title: 'Como a Entre Afetos pode ajudar', text: 'Acolhemos cada criança e família com escuta e técnica, avaliando o processamento sensorial e orientando estratégias personalizadas para o inverno.' },
      { type: 'list-item', title: 'Maior conforto com roupas e rotinas de frio', text: 'Adaptações alinhadas ao perfil sensorial.' },
      { type: 'list-item', title: 'Autorregulação e bem-estar emocional', text: 'Redução de estresse e mais segurança.' },
      { type: 'list-item', title: 'Participação nas atividades escolares e familiares', text: 'Com menos incômodo e mais previsibilidade.' },
      { type: 'paragraph', text: 'O inverno pode ser aconchegante — desde que o corpo se sinta seguro. Adaptar texturas, ajustar a temperatura e respeitar os limites sensoriais é um gesto de cuidado que faz toda a diferença.' },
      { type: 'cta', icon: '📲', text: 'Quer apoio para tornar o inverno mais confortável? Fale com a Entre Afetos e agende uma avaliação.' }
    ]
  }
  ,
  {
    slug: 'o-que-e-tdah-afinal',
    title: 'O que é TDAH, afinal?',
    date: '2025-10-09',
    author: 'Equipe Entre Afetos',
    tag: 'Saúde Emocional',
    cover: '/publicacoes/tdah.png',
    showImage: true,
    content: [
      { type: 'callout', icon: '🧩', title: 'Principais sinais em crianças e adolescentes e como apoiar com empatia', text: 'Entenda o que observar no dia a dia e como oferecer suporte acolhedor e efetivo.' },
      { type: 'paragraph', text: 'O TDAH é um transtorno do neurodesenvolvimento que impacta a forma como a criança regula a atenção, o tempo e os impulsos. Não é “frescura”, falta de limites ou “modinha”. Reconhecer os sinais e oferecer suporte adequado faz toda a diferença no bem-estar, na aprendizagem e nas relações.' },
      { type: 'callout', icon: '🔎', title: 'Principais sinais que podem surgir no dia a dia', text: 'Sinais variam em intensidade e contexto. Observe com carinho:' },
      { type: 'list-item', title: 'Desatenção', text: 'Distrai-se com facilidade, perde objetos, esquece combinados e tem dificuldade para finalizar tarefas.' },
      { type: 'list-item', title: 'Hiperatividade', text: 'Inquietação constante, mexe-se o tempo todo, parece “a mil por hora”.' },
      { type: 'list-item', title: 'Impulsividade', text: 'Interrompe conversas, responde antes da hora, age sem pensar nas consequências.' },
      { type: 'list-item', title: 'Organização e tempo', text: 'Dificuldade para planejar, priorizar e cumprir prazos.' },
      { type: 'list-item', title: 'Emoções', text: 'Frustração rápida, oscilação de humor e ansiedade de desempenho.' },
      { type: 'callout', icon: '⚠️', title: 'Importante', text: 'Cada criança é única. A avaliação correta deve ser feita por profissionais qualificados.' },
      { type: 'callout', icon: '🏫', title: 'Não é só sobre atenção: escola, casa e autoestima', text: 'Sem apoio, o TDAH pode afetar a aprendizagem, a convivência e a autoconfiança. Com estratégias certas, a criança aprende a se organizar melhor, potencializa pontos fortes e aumenta a motivação para estudar e se relacionar.' },
      { type: 'callout', icon: '👉', title: 'Dicas práticas para pais e cuidadores', text: 'Estratégias simples que ajudam no dia a dia.' },
      { type: 'list-item', title: 'Use rotinas visuais e checklists', text: 'Apoie a organização do dia com passos claros.' },
      { type: 'list-item', title: 'Quebre tarefas longas em etapas curtas', text: 'Inclua pausas programadas para regular atenção e energia.' },
      { type: 'list-item', title: 'Dê instruções claras, uma de cada vez', text: 'Peça para a criança repetir o combinado para garantir entendimento.' },
      { type: 'list-item', title: 'Valorize esforço e progresso', text: 'Reforce pequenas conquistas, não apenas o resultado final.' },
      { type: 'list-item', title: 'Combine com a escola ajustes pedagógicos', text: 'Tempo estendido, local com menos distrações e materiais de apoio.' },
      { type: 'callout', icon: '💙', title: 'Como a Entre Afetos pode ajudar', text: 'Oferecemos avaliação e acompanhamento multidisciplinar para TDAH com abordagem acolhedora e baseada em evidências.' },
      { type: 'list-item', title: 'Fortalecer atenção, planejamento e autorregulação', text: 'Desenvolvimento de funções executivas com estratégias práticas.' },
      { type: 'list-item', title: 'Desenvolver estratégias de estudo e organização da rotina', text: 'Ferramentas personalizadas para autonomia e constância.' },
      { type: 'list-item', title: 'Apoiar habilidades socioemocionais e autoestima', text: 'Construção de confiança e manejo emocional.' },
      { type: 'list-item', title: 'Orientar família e escola', text: 'Plano de manejo consistente e empático em todos os ambientes.' },
      { type: 'paragraph', text: 'TDAH é real e tem tratamento. Com escuta, compreensão e intervenções adequadas, crianças e adolescentes podem aprender, se organizar e florescer — no seu tempo e do seu jeito.' },
      { type: 'cta', icon: '📲', text: 'Quer entender melhor se é TDAH e como apoiar? Fale com a Entre Afetos e agende uma avaliação.' }
    ]
  },
  {
    slug: 'o-que-e-apraxia-de-fala',
    title: 'O que é Apraxia de Fala?',
    date: '2025-10-10',
    author: 'Equipe Entre Afetos',
    tag: 'Dicas para Pais',
    cover: '/publicacoes/apraxia.png',
    showImage: true,
    content: [
      { type: 'callout', icon: '🗣️', title: 'Entenda essa condição que afeta os movimentos da boca e como a fonoaudiologia pode ajudar', text: 'A Apraxia de Fala Infantil (AFI) é uma condição neurológica que afeta a capacidade de planejar e coordenar os movimentos necessários para a fala.' },
      { type: 'paragraph', text: 'É uma condição que afeta os movimentos que o cérebro envia para a boca.' },
      { type: 'paragraph', text: 'É importante procurar um fonoaudiólogo especializado, pois o tratamento costuma envolver terapias para ajudar a melhorar a coordenação e consideração da fluência da fala.' },
      { type: 'callout', icon: '🎼', title: 'Imagine um maestro tentando reger uma orquestra', text: 'Na AFI, o cérebro (maestro) sabe o que quer "tocar" (falar), mas tem dificuldade para coordenar os músculos da boca, língua e lábios (instrumentos) de forma precisa e fluida.' },
      { type: 'callout', icon: '⚠️', title: 'Sinais de alerta que merecem atenção', text: 'Observe estes comportamentos que podem indicar AFI:' },
      { type: 'list-item', title: 'Atraso significativo na fala', text: 'Poucas palavras ou sons aos 2 anos de idade.' },
      { type: 'list-item', title: 'Dificuldade para imitar sons e palavras', text: 'Mesmo quando tenta, os sons saem diferentes do esperado.' },
      { type: 'list-item', title: 'Inconsistência na produção de palavras', text: 'Fala uma palavra corretamente uma vez, mas não consegue repetir.' },
      { type: 'list-item', title: 'Movimentos orais descoordenados', text: 'Dificuldade para mastigar, engolir ou fazer caretas.' },
      { type: 'list-item', title: 'Frustração ao tentar se comunicar', text: 'A criança sabe o que quer dizer, mas não consegue expressar.' },
      { type: 'list-item', title: 'Preferência por gestos em vez de palavras', text: 'Usa mais sinais e apontamentos para se comunicar.' },
      { type: 'list-item', title: 'Dificuldade com sequências de movimentos', text: 'Problemas para combinar sons em sílabas e palavras.' },
      { type: 'list-item', title: 'Prosódia alterada', text: 'Ritmo, entonação e velocidade da fala podem parecer diferentes.' },
      { type: 'callout', icon: '🩺', title: 'Por que a avaliação fonoaudiológica é fundamental?', text: 'Somente um fonoaudiólogo especializado pode distinguir AFI de outros atrasos de fala e criar um plano de tratamento adequado. O diagnóstico precoce e a intervenção fazem toda a diferença no desenvolvimento da comunicação.' },
      { type: 'callout', icon: '💙', title: 'Como a Entre Afetos pode ajudar', text: 'Nossa equipe de fonoaudiologia oferece avaliação especializada e tratamento personalizado para AFI.' },
      { type: 'list-item', title: 'Avaliação detalhada dos movimentos orais e da fala', text: 'Identificação precisa das dificuldades específicas de cada criança.' },
      { type: 'list-item', title: 'Terapia motora da fala especializada', text: 'Exercícios específicos para melhorar a coordenação e precisão dos movimentos.' },
      { type: 'list-item', title: 'Estratégias de comunicação alternativa', text: 'Uso de gestos, símbolos e tecnologia assistiva quando necessário.' },
      { type: 'list-item', title: 'Orientação familiar', text: 'Ensino de técnicas para estimular a comunicação em casa.' },
      { type: 'paragraph', text: 'Com paciência, técnica adequada e apoio familiar, crianças com AFI podem desenvolver habilidades de comunicação efetivas e ganhar confiança para se expressar.' },
      { type: 'cta', icon: '📞', text: 'Suspeita de Apraxia de Fala? Nossa equipe está pronta para avaliar e apoiar o desenvolvimento da comunicação do seu filho. Entre em contato conosco!' }
    ]
  }
];

const PublicationArticle = () => {
  const { slug } = useParams();
  const article = useMemo(() => articles.find(a => a.slug === slug), [slug]);
  const related = useMemo(() => {
    if (!article) return [];
    return articles
      .filter(a => a.slug !== slug && a.tag === article.tag)
      .slice(0, 3);
  }, [slug, article]);

  if (!article) {
    return (
      <div className="article-page">
        <section className="article-hero">
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h1>Publicação não encontrada</h1>
              <p>A publicação que você está procurando não existe ou foi removida.</p>
              <Link to="/publicacoes" className="btn btn-primary">← Voltar para Publicações</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="article-page">
      <section className="article-hero">
        <div className="container">
          <h1>{article.title}</h1>
          <p className="meta">{article.date} • {article.author}</p>
        </div>
      </section>
      
      <section className="article-content">
        <div className="container article-container">
          {article.showImage && (
            <div className="article-image-featured">
              <img src={article.cover} alt={article.title} />
            </div>
          )}
          
          <div className="article-body">
            {article.content.map((block, index) => {
              if (block.type === 'paragraph') {
                return <p key={index} className="article-paragraph">{block.text}</p>;
              }
              if (block.type === 'list-item') {
                return (
                  <div key={index} className="article-list-item">
                    <h3 className="list-item-title">{block.title}</h3>
                    <p className="list-item-text">{block.text}</p>
                  </div>
                );
              }
              if (block.type === 'callout') {
                return (
                  <div key={index} className="article-callout">
                    <div className="callout-header">
                      <span className="callout-icon">{block.icon}</span>
                      <h3 className="callout-title">{block.title}</h3>
                    </div>
                    <p className="callout-text">{block.text}</p>
                  </div>
                );
              }
              if (block.type === 'cta') {
                return (
                  <div key={index} className="article-cta">
                    <span className="cta-icon">{block.icon}</span>
                    <p className="cta-text">{block.text}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="article-cta-contact">
            <div className="cta-contact-content">
              <h3>Precisa de ajuda profissional?</h3>
              <p>Nossa equipe está preparada para acolher e apoiar sua família nesse processo. Agende uma consulta e descubra como podemos ajudar seu filho a desenvolver todo seu potencial.</p>
              <a 
                href={`https://wa.me/5583986102718?text=Olá! Vi a publicação "${article.title}" e gostaria de agendar uma consulta.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cta-large"
              >
                📅 Agende sua Consulta
              </a>
            </div>
          </div>

          <div className="article-nav">
            <Link to="/publicacoes" className="btn btn-secondary">← Voltar para Publicações</Link>
          </div>

          {related.length > 0 && (
            <div className="related">
              <h3>Outras publicações do mesmo tema</h3>
              <div className="related-grid">
                {related.map(r => (
                  <Link key={r.slug} to={`/publicacoes/${r.slug}`} className="related-card">
                    <img src={r.cover} alt={r.title} />
                    <h4>{r.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PublicationArticle;


