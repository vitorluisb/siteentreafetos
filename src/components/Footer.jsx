import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaHeart,
  FaClock
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
              <li><Link to="/sobre/historia">Nossa História</Link></li>
              <li><Link to="/sobre/equipe">Equipe</Link></li>
              <li><Link to="/servicos">Especialidades</Link></li>
              <li><Link to="/galeria">Galeria</Link></li>
              <li><Link to="/publicacoes">Publicações</Link></li>
              <li><Link to="/contato">Contato</Link></li>
              <li><Link to="/trabalhe-conosco">Trabalhe Conosco</Link></li>
            </ul>
          </div>

          {/* Especialidades - Coluna 1 */}
          <div className="footer-section">
            <h3 className="footer-title">Especialidades</h3>
            <ul className="footer-links footer-links-compact">
              <li>Fonoaudiologia</li>
              <li>Terapia Ocupacional</li>
              <li>Psicologia</li>
              <li>Psicopedagogia</li>
              <li>Nutrição</li>
              <li>Fisioterapia</li>
            </ul>
          </div>

          {/* Especialidades - Coluna 2 */}
          <div className="footer-section">
            <h3 className="footer-title" style={{ opacity: 0 }}>Especialidades</h3>
            <ul className="footer-links footer-links-compact">
              <li>Analista do Comportamento</li>
              <li>Acompanhante Terapêutico</li>
              <li>Psicomotricista</li>
              <li>Hidroterapia</li>
              <li>Natação</li>
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
              <div className="contact-item">
                <FaClock />
                <div>
                  <p>Segunda a Sexta: 8:00 às 19:00</p>
                  <p>Sábado: 8:00 às 12:00</p>
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

