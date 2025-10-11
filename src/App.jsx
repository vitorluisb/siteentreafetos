import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import BusinessCardPage from './pages/BusinessCard';
import WorkWithUs from './pages/WorkWithUs';
import Gallery from './pages/Gallery';
import AboutHistory from './pages/AboutHistory';
import AboutTeam from './pages/AboutTeam';
import Publications from './pages/Publications';
import PublicationArticle from './pages/PublicationArticle';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Notices from './pages/admin/Notices';
import Chat from './pages/admin/Chat';
import Documents from './pages/admin/Documents';
import Polls from './pages/admin/Polls';
import Calendar from './pages/admin/Calendar';
import Users from './pages/admin/Users';
import Profile from './pages/admin/Profile';
import Inactive from './pages/admin/Inactive';
import SetupAdmin from './pages/admin/SetupAdmin';
import DiagnosticAdmin from './pages/admin/DiagnosticAdmin';
import './App.css';

/**
 * App Component - Componente raiz da aplicação
 * 
 * Gerencia todas as rotas da aplicação e define quais páginas
 * utilizam o layout completo e quais são independentes.
 * 
 * Rotas:
 * - /cartao: Cartão digital independente (sem layout)
 * - Demais rotas: Páginas com layout completo (nav + footer + chatbot)
 * 
 * @returns {JSX.Element} Aplicação completa com roteamento
 */
function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rota independente para cartão digital */}
              <Route path="/cartao" element={<BusinessCardPage />} />
              
              {/* Rota de redirecionamento para login */}
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />
              
              {/* Rota de login do painel administrativo */}
              <Route path="/admin/login" element={<Login />} />
              
              {/* Rota para usuários inativos */}
              <Route path="/admin/inactive" element={<Inactive />} />
              
              {/* Rotas protegidas do painel administrativo */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="notices" element={<Notices />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="polls" element={<Polls />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="users" element={<Users />} />
                    <Route path="setup" element={<SetupAdmin />} />
                    <Route path="diagnostic" element={<DiagnosticAdmin />} />
              </Route>
              
              {/* Rotas principais com layout completo */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/sobre/historia" element={<Layout><AboutHistory /></Layout>} />
              <Route path="/sobre/equipe" element={<Layout><AboutTeam /></Layout>} />
              <Route path="/servicos" element={<Layout><Services /></Layout>} />
              <Route path="/galeria" element={<Layout><Gallery /></Layout>} />
              <Route path="/publicacoes" element={<Layout><Publications /></Layout>} />
              <Route path="/publicacoes/:slug" element={<Layout><PublicationArticle /></Layout>} />
              <Route path="/contato" element={<Layout><Contact /></Layout>} />
              <Route path="/trabalhe-conosco" element={<Layout><WorkWithUs /></Layout>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
