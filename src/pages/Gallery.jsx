import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Gallery.css';

// Imagens existentes no projeto
import clinicarec from '../assets/clinica/clinicarec.png';
import clinicasolanea from '../assets/clinica/clinicasolanea.png';
import clinicsala from '../assets/clinica/clinicsala.png';
import membro from '../assets/equipe/membro.png';
import membro1 from '../assets/equipe/membro1.png';
import membro2 from '../assets/equipe/membro2.png';

const CATEGORIES = ['Todos', 'Atividades', 'Ambiente', 'Eventos'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const images = useMemo(() => ([
    { src: clinicarec, alt: 'Recepção - Ambiente acolhedor', tags: ['Ambiente'] },
    { src: clinicasolanea, alt: 'Fachada - Unidade Solânea', tags: ['Ambiente', 'Eventos'] },
    { src: clinicsala, alt: 'Sala de atendimento infantil', tags: ['Ambiente', 'Atividades'] },
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


