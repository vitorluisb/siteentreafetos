import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaHeart
} from 'react-icons/fa';
import '../styles/Footer.css';

// Import da logo
import entreafetosLogo from '../assets/logo/entreafetoslogo.png';

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo e Descrição */}
          <div className="footer-section footer-brand">
            <Link to="/" className="footer-logo">
              <img 
                src={entreafetosLogo} 
                alt="Entre Afetos" 
                className="footer-logo-image"
              />
            </Link>
            <p className="footer-description">
              Cuidamos com carinho e profissionalismo do desenvolvimento emocional 
              de crianças e adolescentes, criando um ambiente seguro e acolhedor 
              para o crescimento saudável.
            </p>
            <div className="footer-social">
              <a 
                href="https://facebook.com/clinicaentreafetos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a 
                href="https://instagram.com/clinicaentreafetos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

            </div>
          </div>

          {/* Links Rápidos */}
          <div className="footer-section">
            <h3 className="footer-title">Links Rápidos</h3>
            <ul className="footer-links">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/sobre">Sobre Nós</Link></li>
              <li><Link to="/especialidades">Especialidades</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </div>

          {/* Especialidades */}
          <div className="footer-section">
            <h3 className="footer-title">Especialidades</h3>
            <ul className="footer-links">
              <li>Psicologia Infantil</li>
              <li>Psicologia Adolescente</li>
              <li>Terapia Familiar</li>
              <li>Orientacao Vocacional</li>
              <li>Avaliacao Psicologica</li>
            </ul>
          </div>

          {/* Contato */}
          <div className="footer-section">
            <h3 className="footer-title">Contato</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <FaMapMarkerAlt />
                <div>
                  <p>Guarabira - PB</p>
                  <p>Solânea - PB</p>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone />
                <div>
                  <p>(83) 98610-2718</p>
                <p>(83) 98610-2718</p>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <div>
                  <p>contato@entreafetos.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Rodapé Inferior */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Clínica Entre Afetos. Todos os direitos reservados.
            </p>
            <div className="footer-bottom-links">
              <Link to="/politica-privacidade">Política de Privacidade</Link>
              <Link to="/termos-uso">Termos de Uso</Link>
            </div>
          </div>
          <div className="footer-heart">
            <FaHeart />
            <span>Feito com amor para cuidar de quem você ama</span>
          </div>

          {/* Crédito discreto do desenvolvedor */}
          <div className="developer-credit">
            <small className="developer-credit-text">
              <a href="https://vitordevcart.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                Desenvolvido por Vitor Luis
              </a>
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

