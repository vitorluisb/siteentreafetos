import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/AboutSubpages.css';
import membro from '../assets/equipe/membro.png';
import membro1 from '../assets/equipe/membro1.png';
import membro2 from '../assets/equipe/membro2.png';

const TEAM = [
  { id: 1, name: 'Dra. Ana Maria', role: 'Psicóloga', unit: 'Unidade 1', photo: membro },
  { id: 2, name: 'Dra. Patrícia Lima', role: 'Terapeuta Familiar', unit: 'Unidade 2', photo: membro1 },
  { id: 3, name: 'Dra. Carla Santos', role: 'Nutricionista', unit: 'Unidade 3', photo: membro2 },
];

const FILTERS = ['Todos', 'Unidade 1', 'Unidade 2', 'Unidade 3'];

const AboutTeam = () => {
  const [filter, setFilter] = useState('Todos');
  const [flipped, setFlipped] = useState({});
  const [hoverStates, setHoverStates] = useState({});
  const filtered = TEAM.filter(p => filter === 'Todos' ? true : p.unit === filter);

  const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }
  };

  const toggleFlip = (id) => setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  const isFlipped = (id) => flipped[id] || hoverStates[id];

  return (
    <div className="about-subpage">
      <section className="sub-hero">
        <div className="container">
          <h1>Equipe</h1>
          <p className="intro">Nossa equipe dedicada ao desenvolvimento infantil.</p>
        </div>
      </section>

      <section className="sub-content">
        <div className="container">
          <div className="filters">
            {FILTERS.map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="team-grid">
            <AnimatePresence mode="popLayout">
              {filtered.map(m => (
                <motion.div
                  key={m.id}
                  className={`team-card ${isFlipped(m.id) ? 'flipped' : ''}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  onClick={(e) => { e.preventDefault(); toggleFlip(m.id); }}
                  onMouseEnter={() => setHoverStates(prev => ({ ...prev, [m.id]: true }))}
                  onMouseLeave={() => setHoverStates(prev => ({ ...prev, [m.id]: false }))}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(m.id); } }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isFlipped(m.id)}
                >
                  <div className="card-inner">
                    <div className="card-front">
                      <div className="member-photo"><img src={m.photo} alt={m.name} className="photo-image" /></div>
                      <h3>{m.name}</h3>
                      <p className="role">{m.role}</p>
                      <span className="unit">{m.unit}</span>
                      <div className="flip-hint"><span>Clique ou passe o mouse para saber mais</span></div>
                    </div>
                    <div className="card-back">
                      <h3>{m.name}</h3>
                      <p className="role">{m.role}</p>
                      <p className="unit">{m.unit}</p>
                      <p className="bio">Profissional dedicado(a) ao cuidado infantil, atuando de forma acolhedora e baseada em evidências.</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutTeam;


