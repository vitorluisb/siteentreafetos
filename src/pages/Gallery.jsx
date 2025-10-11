import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Gallery.css';

// URLs das imagens da Unidade Aquarela (pasta public)
const aparelhos = '/cliniaquarela/aparelhos.jpg';
const balanco = '/cliniaquarela/balanco.jpg';
const corredor = '/cliniaquarela/corredor.jpg';
const escalada = '/cliniaquarela/escalada.jpg';
const frenteaquarela = '/cliniaquarela/frenteaquqrela.JPG';
const salaatividades = '/cliniaquarela/salaatividades.jpg';
const salaatividades2 = '/cliniaquarela/salaatividades2.jpg';
const salaatividades4 = '/cliniaquarela/salaatividades4.jpg';

// URLs das imagens da Unidade Arco-íris (pasta public)
const arcoAparelhos = '/cliniarco/aparelhos.jpg';
const arcoAparelhos2 = '/cliniarco/aparelhos2.jpg';
const arcoAparelhos4 = '/cliniarco/aparelhos4.jpg';
const arcoAparelhos3 = '/cliniarco/aparelhso3.jpg';
const arcond = '/cliniarco/arcond.jpg';
const arcoAtendimento3 = '/cliniarco/atendimento3.jpg';
const arcoBrinquedos = '/cliniarco/brinquedos.jpg';
const arcoEquipamentos = '/cliniarco/equipamentos.jpg';
const arcoFachadaEspecialidades = '/cliniarco/fachadaespecialidades.jpg';
const arcoFachada = '/cliniarco/fachadalogo.jpg';
const arcoRall = '/cliniarco/rall.jpg';
const arcoSala3 = '/cliniarco/sala3.jpg';
const arcoSalaAted = '/cliniarco/salaated.jpg';
const arcoSalaAtividades = '/cliniarco/saladeatividades.jpg';
const arcoImagem = '/cliniarco/484e4a0a-953f-4527-80cb-b1b3f63800cf.JPG';

// URLs das imagens da Unidade Jardim (pasta public)
const jardimAtendimento = '/clinicajardim/atedinmento.jpg';
const jardimAtendimentoSola = '/clinicajardim/atendimentosola.JPG';
const jardimBrinquedos = '/clinicajardim/brinquedos.jpg';
const jardimFrente = '/clinicajardim/frentesolanea.JPG';
const jardimJardim = '/clinicajardim/jardim.JPG';
const jardimMesinha = '/clinicajardim/mesinha.JPG';
const jardimParede = '/clinicajardim/parede.JPG';
const jardimParede2 = '/clinicajardim/parede2.JPG';
const jardimParedeLogo = '/clinicajardim/paredelogo.JPG';
const jardimRall = '/clinicajardim/rallentrad.JPG';
const jardimSalaAtend = '/clinicajardim/saladeatend.JPG';

// URLs das imagens de Atendimentos (pasta public)
const atendimento1 = '/atendimento/IMG_0365.jpg';
const atendimento2 = '/atendimento/IMG_0962.jpg';
const atendimento3 = '/atendimento/IMG_0963.jpg';
const atendimento4 = '/atendimento/IMG_1010.jpg';
const atendimento5 = '/atendimento/IMG_1015.jpg';
const atendimento6 = '/atendimento/IMG_1016.jpg';
const atendimento7 = '/atendimento/IMG_1677.jpg';
const atendimento8 = '/atendimento/IMG_2261.jpg';
const atendimento9 = '/atendimento/IMG_4633.jpg';
const atendimento10 = '/atendimento/IMG_4636.jpg';

const CATEGORIES = ['Todos', 'Unidade Aquarela', 'Unidade Arco-íris', 'Unidade Jardim', 'Atendimentos'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const images = useMemo(() => ([
    // Unidade Aquarela
    { src: frenteaquarela, alt: 'Frente - Unidade Aquarela', tags: ['Unidade Aquarela'] },
    { src: aparelhos, alt: 'Aparelhos - Unidade Aquarela', tags: ['Unidade Aquarela'] },
    { src: balanco, alt: 'Balanço - Unidade Aquarela', tags: ['Unidade Aquarela'] },
    { src: corredor, alt: 'Corredor - Unidade Aquarela', tags: ['Unidade Aquarela'] },
    { src: escalada, alt: 'Escalada - Unidade Aquarela', tags: ['Unidade Aquarela'] },
    { src: salaatividades, alt: 'Sala de Atividades - Unidade Aquarela', tags: ['Unidade Aquarela'] },
    { src: salaatividades2, alt: 'Sala de Atividades 2 - Unidade Aquarela', tags: ['Unidade Aquarela'] },
    { src: salaatividades4, alt: 'Sala de Atividades 4 - Unidade Aquarela', tags: ['Unidade Aquarela'] },
    
    // Unidade Arco-íris
    { src: arcoImagem, alt: 'Ambiente - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoFachada, alt: 'Fachada - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoFachadaEspecialidades, alt: 'Fachada Especialidades - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoAparelhos, alt: 'Aparelhos - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoAparelhos2, alt: 'Aparelhos 2 - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoAparelhos3, alt: 'Aparelhos 3 - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoAparelhos4, alt: 'Aparelhos 4 - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoEquipamentos, alt: 'Equipamentos - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoSalaAtividades, alt: 'Sala de Atividades - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoSala3, alt: 'Sala 3 - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoSalaAted, alt: 'Sala de Atendimento - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoAtendimento3, alt: 'Atendimento 3 - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoBrinquedos, alt: 'Brinquedos - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcond, alt: 'Ambiente - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    { src: arcoRall, alt: 'Hall - Unidade Arco-íris', tags: ['Unidade Arco-íris'] },
    
    // Unidade Jardim
    { src: jardimFrente, alt: 'Frente - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimJardim, alt: 'Jardim - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimAtendimento, alt: 'Atendimento - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimAtendimentoSola, alt: 'Atendimento Sola - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimSalaAtend, alt: 'Sala de Atendimento - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimBrinquedos, alt: 'Brinquedos - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimMesinha, alt: 'Mesinha - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimParedeLogo, alt: 'Parede com Logo - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimParede, alt: 'Parede - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimParede2, alt: 'Parede 2 - Unidade Jardim', tags: ['Unidade Jardim'] },
    { src: jardimRall, alt: 'Hall de Entrada - Unidade Jardim', tags: ['Unidade Jardim'] },
    
    // Atendimentos
    { src: atendimento1, alt: 'Atendimento - Sala de Terapia', tags: ['Atendimentos'] },
    { src: atendimento2, alt: 'Atendimento - Ambiente Terapêutico', tags: ['Atendimentos'] },
    { src: atendimento3, alt: 'Atendimento - Espaço de Atividades', tags: ['Atendimentos'] },
    { src: atendimento4, alt: 'Atendimento - Sala de Estimulação', tags: ['Atendimentos'] },
    { src: atendimento5, alt: 'Atendimento - Área de Desenvolvimento', tags: ['Atendimentos'] },
    { src: atendimento6, alt: 'Atendimento - Espaço Sensorial', tags: ['Atendimentos'] },
    { src: atendimento7, alt: 'Atendimento - Sala de Integração', tags: ['Atendimentos'] },
    { src: atendimento8, alt: 'Atendimento - Ambiente de Apoio', tags: ['Atendimentos'] },
    { src: atendimento9, alt: 'Atendimento - Espaço Multifuncional', tags: ['Atendimentos'] },
    { src: atendimento10, alt: 'Atendimento - Sala de Reabilitação', tags: ['Atendimentos'] }
  ]), []);

  const filtered = useMemo(() => {
    if (activeCategory === 'Todos') return images;
    return images.filter(img => img.tags.includes(activeCategory));
  }, [images, activeCategory]);

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % filtered.length);
  }, [filtered.length]);

  // Fecha com ESC
  useEffect(() => {
    const onKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeLightbox, showPrev, showNext]);

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Nossa Galeria de Momentos
          </motion.h1>
          <motion.p className="subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            Um espaço para compartilhar um pouco do carinho, cuidado e ambiente acolhedor da nossa clínica infantil.
          </motion.p>
          <div className="filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-grid-section">
        <div className="container">
          <div className="gallery-grid">
            {filtered.map((img, index) => (
              <motion.button
                key={`${img.src}-${index}`}
                className="gallery-item"
                onClick={() => openLightbox(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="badge-row">
                  {img.tags.map((t) => (
                    <span className="badge" key={t}>{t}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gallery-cta">
        <div className="container">
          <div className="cta-card">
            <h3>Quer conhecer de perto nosso espaço? Agende uma visita!</h3>
            <a href="/contato" className="btn btn-primary btn-lg">Agendar visita</a>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={closeLightbox} aria-label="Fechar">×</button>
              <button className="lightbox-prev" onClick={showPrev} aria-label="Anterior">‹</button>
              <img src={filtered[lightboxIndex]?.src} alt={filtered[lightboxIndex]?.alt} />
              <button className="lightbox-next" onClick={showNext} aria-label="Próximo">›</button>
              <p className="lightbox-caption">{filtered[lightboxIndex]?.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;


