import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/PublicationArticle.css';

const articles = [
  {
    slug: 'isso-e-birra-sera-mesmo',
    title: '"Isso é birra!" Será mesmo? 😡',
    date: '2025-10-04',
    author: 'Equipe Entre Afetos',
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
  }
];

const PublicationArticle = () => {
  const { slug } = useParams();
  const article = useMemo(() => articles.find(a => a.slug === slug), [slug]);
  const related = useMemo(() => articles.filter(a => a.slug !== slug).slice(0, 2), [slug]);

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
              <h3>Você também pode gostar</h3>
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


