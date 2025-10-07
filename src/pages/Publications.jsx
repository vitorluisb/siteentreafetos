import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Publications.css';

const TAGS = ['Todas', 'Dificuldades de Aprendizagem', 'Saúde Emocional', 'Dicas para Pais'];

const Publications = () => {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('Todas');

  const posts = useMemo(() => ([
    {
      slug: 'isso-e-birra-sera-mesmo',
      title: '"Isso é birra!" Será mesmo? 😡',
      excerpt: 'Entenda o que pode estar por trás do comportamento infantil e como ajudar seu filho a lidar com as emoções.',
      cover: '/publicacoes/birra.png',
      tag: 'Dicas para Pais',
      date: '2025-10-04',
      author: 'Equipe Entre Afetos'
    },
    {
      slug: '5-sinais-dificuldades-aprendizagem',
      title: '5 sinais de que seu filho pode estar enfrentando dificuldades na aprendizagem',
      excerpt: 'Identificar precocemente os sinais de dificuldades de aprendizagem é fundamental para oferecer o suporte adequado e garantir o desenvolvimento pleno da criança.',
      cover: '/publicacoes/5sinais.png',
      tag: 'Dificuldades de Aprendizagem',
      date: '2025-10-04',
      author: 'Equipe Entre Afetos'
    },
    {
      slug: 'integracao-sensorial-sentidos-organizados',
      title: 'Integração Sensorial: quando os sentidos se organizam, o mundo faz mais sentido',
      excerpt: 'Como a integração sensorial apoia atenção, aprendizagem e comportamento em crianças e adolescentes.',
      cover: '/publicacoes/sensorial.png',
      tag: 'Saúde Emocional',
      date: '2025-10-05',
      author: 'Equipe Entre Afetos'
    }
    ,
    {
      slug: 'dificuldades-na-escola-ainda-da-tempo-de-superar',
      title: 'Dificuldades na escola? Ainda dá tempo de superar isso!',
      excerpt: 'Como identificar os sinais, apoiar em casa e buscar o suporte certo para o aprendizado.',
      cover: '/publicacoes/dificuldadeescolar.png',
      tag: 'Dificuldades de Aprendizagem',
      date: '2025-10-05',
      author: 'Equipe Entre Afetos'
    },
    {
      slug: 'falar-tarde-nem-sempre-e-so-uma-fase',
      title: 'Falar tarde nem sempre é só uma fase',
      excerpt: 'Quando buscar ajuda para o desenvolvimento da fala e da linguagem.',
      cover: '/publicacoes/fala.png',
      tag: 'Dicas para Pais',
      date: '2025-10-07',
      author: 'Equipe Entre Afetos'
    },
    {
      slug: 'seu-filho-parece-molinho-pode-ser-hipotonia',
      title: 'Seu filho parece "molinho"? Pode ser hipotonia — e merece atenção',
      excerpt: 'Como identificar sinais, quando buscar avaliação e o que ajuda no dia a dia.',
      cover: '/publicacoes/molinho.png',
      tag: 'Dicas para Pais',
      date: '2025-10-07',
      author: 'Equipe Entre Afetos'
    },
    {
      slug: 'dificuldade-na-escrita-pode-ser-tdah',
      title: 'Dificuldade na escrita pode ser TDAH?',
      excerpt: 'Nem todo erro na escrita é distração — entenda as causas e como ajudar.',
      cover: '/publicacoes/escrita.png',
      tag: 'Dificuldades de Aprendizagem',
      date: '2025-10-07',
      author: 'Equipe Entre Afetos'
    }
  ]), []);

  const filtered = posts.filter(p => {
    const matchesTag = tag === 'Todas' ? true : p.tag === tag;
    const q = query.trim().toLowerCase();
    const matchesQuery = q === '' ? true : (p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    return matchesTag && matchesQuery;
  });

  return (
    <div className="publications-page">
      <section className="pub-hero">
        <div className="container">
          <h1>Publicações</h1>
          <p className="subtitle">Um espaço para compartilhar informações, dicas e conteúdos que podem ajudar famílias e crianças em seu processo de desenvolvimento.</p>
        </div>
      </section>

      <section className="pub-controls">
        <div className="container">
          <div className="controls-row">
            <div className="search">
              <input
                type="search"
                placeholder="Buscar por palavra-chave..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar publicações"
              />
            </div>
            <div className="tags">
              {TAGS.map(t => (
                <button key={t} className={`tag-btn ${tag === t ? 'active' : ''}`} onClick={() => setTag(t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pub-grid-section">
        <div className="container">
          {filtered.length > 0 ? (
            <div className="pub-grid">
              {filtered.map((p) => (
                <article key={p.slug} className="pub-card-image-only">
                  <div className="pub-image-wrapper">
                    <img src={p.cover} alt={p.title} loading="lazy" />
                  </div>
                  <div className="pub-action">
                    <Link to={`/publicacoes/${p.slug}`} className="btn btn-primary">Leia mais</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h2>Nenhuma publicação disponível</h2>
              <p>Em breve teremos novos conteúdos para você!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Publications;


