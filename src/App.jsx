import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Lazy loading para componentes críticos (carregados imediatamente)
import Home from './pages/Home';

// Lazy loading para componentes não críticos
const Services = React.lazy(() => import('./pages/Services'));
const Contact = React.lazy(() => import('./pages/Contact'));
const BusinessCardPage = React.lazy(() => import('./pages/BusinessCard'));
const WorkWithUs = React.lazy(() => import('./pages/WorkWithUs'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const AboutHistory = React.lazy(() => import('./pages/AboutHistory'));
const AboutTeam = React.lazy(() => import('./pages/AboutTeam'));
const Publications = React.lazy(() => import('./pages/Publications'));
const PublicationArticle = React.lazy(() => import('./pages/PublicationArticle'));

// Lazy loading para componentes admin
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const Login = React.lazy(() => import('./pages/admin/Login'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Notices = React.lazy(() => import('./pages/admin/Notices'));
const Chat = React.lazy(() => import('./pages/admin/Chat'));
const Documents = React.lazy(() => import('./pages/admin/Documents'));
const Polls = React.lazy(() => import('./pages/admin/Polls'));
const Calendar = React.lazy(() => import('./pages/admin/Calendar'));
const Users = React.lazy(() => import('./pages/admin/Users'));
const Profile = React.lazy(() => import('./pages/admin/Profile'));
const Inactive = React.lazy(() => import('./pages/admin/Inactive'));
const SetupAdmin = React.lazy(() => import('./pages/admin/SetupAdmin'));
const DiagnosticAdmin = React.lazy(() => import('./pages/admin/DiagnosticAdmin'));

// Componente de loading
const LoadingSpinner = () => (
  <Center h="100vh">
    <Spinner size="xl" color="blue.500" thickness="4px" />
  </Center>
);

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
            <Suspense fallback={<LoadingSpinner />}>
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
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
