import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Navigation.css';

// Import da logo
import entreafetosLogo from '../assets/logo/entreafetoslogo.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSobreOpen, setIsSobreOpen] = useState(false); // dropdown desktop
  const [isSobreMobileOpen, setIsSobreMobileOpen] = useState(false); // submenu mobile
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Início' },
    {
      path: '/sobre',
      label: 'Sobre',
      children: [
        { path: '/sobre/historia', label: 'História' },
        { path: '/sobre/equipe', label: 'Equipe' },
      ],
    },
    { path: '/servicos', label: 'Especialidades' },
    { path: '/galeria', label: 'Galeria' },
    { path: '/publicacoes', label: 'Publicações' },
    { path: '/contato', label: 'Contato' },
    { path: '/trabalhe-conosco', label: 'Trabalhe Conosco' }
  ];

  return (
    <motion.nav 
      className={`navigation ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <motion.div
              className="logo-container"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={entreafetosLogo} 
                alt="Entre Afetos Logo" 
                className="logo-image"
              />
            </motion.div>
          </Link>

          {/* Menu Desktop */}
          <div className="nav-menu">
            {navItems.filter(item => item.path !== '/trabalhe-conosco').map((item) => (
              <div
                key={item.path}
                className="nav-item-wrapper"
                onMouseEnter={() => item.children && setIsSobreOpen(true)}
                onMouseLeave={() => item.children && setIsSobreOpen(false)}
              >
                {item.children ? (
                  <span className={`nav-link ${location.pathname.startsWith('/sobre') ? 'active' : ''}`}>{item.label}</span>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                )}
                {item.children && (
                  <div className={`dropdown ${isSobreOpen ? 'open' : ''}`}>
                    {item.children.map((sub) => (
                      <Link key={sub.path} to={sub.path} className="dropdown-link">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botão CTA Desktop */}
          <Link
            to="/trabalhe-conosco"
            className={`nav-cta ${location.pathname === '/trabalhe-conosco' ? 'active' : ''}`}
          >
            Trabalhe Conosco
          </Link>


          {/* Botão Menu Mobile */}
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.div>
          </button>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-menu-content">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {!item.children ? (
                      <Link
                        to={item.path}
                        className={`${item.path === '/trabalhe-conosco' ? 'mobile-nav-cta' : 'mobile-nav-link'} ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div className="mobile-submenu">
                        <button
                          className="mobile-nav-link submenu-toggle"
                          onClick={() => setIsSobreMobileOpen(!isSobreMobileOpen)}
                          aria-expanded={isSobreMobileOpen}
                        >
                          {item.label}
                        </button>
                        <AnimatePresence>
                          {isSobreMobileOpen && (
                            <motion.div
                              className="mobile-submenu-links"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              {item.children.map((sub) => (
                                <Link key={sub.path} to={sub.path} className="mobile-submenu-link" onClick={closeMenu}>
                                  {sub.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                ))}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;

