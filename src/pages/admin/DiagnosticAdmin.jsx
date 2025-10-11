import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

const DiagnosticAdmin = () => {
  const { user, userProfile } = useAuth();
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    if (user) {
      runDiagnostic();
    }
  }, [user]);

  const runDiagnostic = async () => {
    setLoading(true);
    const results = {};

    try {
      // 1. Verificar dados do usuário atual
      results.user = {
        id: user?.id,
        email: user?.email,
        metadata: user?.user_metadata,
        app_metadata: user?.app_metadata
      };

      // 2. Verificar perfil do usuário
      results.userProfile = userProfile;

      // 2.5. Verificar se existe na tabela profiles
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single();
        
        results.profilesTable = {
          success: !profileError,
          data: profileData,
          error: profileError?.message,
          exists: !!profileData
        };
      } catch (error) {
        results.profilesTable = {
          success: false,
          error: error.message,
          exists: false
        };
      }

      // 3. Testar acesso à tabela notices
      try {
        const { data: notices, error: noticesError } = await supabase
          .from('notices')
          .select('*')
          .limit(1);
        
        results.noticesAccess = {
          success: !noticesError,
          error: noticesError?.message,
          data: notices
        };
      } catch (error) {
        results.noticesAccess = {
          success: false,
          error: error.message
        };
      }

      // 4. Testar criação de notice (sem salvar)
      try {
        const testNotice = {
          title: 'Teste Diagnóstico',
          content: 'Este é um teste para verificar permissões',
          sector: 'geral',
          author_id: user.id
        };

        const { data, error } = await supabase
          .from('notices')
          .insert([testNotice])
          .select()
          .single();

        if (!error) {
          // Se conseguiu inserir, deletar imediatamente
          await supabase
            .from('notices')
            .delete()
            .eq('id', data.id);
          
          results.noticeCreation = {
            success: true,
            message: 'Teste de criação bem-sucedido'
          };
        } else {
          results.noticeCreation = {
            success: false,
            error: error.message,
            code: error.code
          };
        }
      } catch (error) {
        results.noticeCreation = {
          success: false,
          error: error.message
        };
      }

      // 5. Verificar políticas RLS
      try {
        const { data: policies, error: policiesError } = await supabase
          .rpc('get_table_policies', { table_name: 'notices' })
          .single();
        
        results.policies = {
          success: !policiesError,
          data: policies,
          error: policiesError?.message
        };
      } catch (error) {
        results.policies = {
          success: false,
          error: 'Não foi possível verificar políticas RLS'
        };
      }

      setDiagnosticData(results);
    } catch (error) {
      console.error('Erro no diagnóstico:', error);
      setDiagnosticData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { role: 'admin' }
      });

      if (error) {
        setTestResults(prev => ({
          ...prev,
          roleUpdate: { success: false, error: error.message }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          roleUpdate: { success: true, data }
        }));
        
        // Rerun diagnostic after role update
        setTimeout(runDiagnostic, 1000);
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        roleUpdate: { success: false, error: error.message }
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Executando diagnóstico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Diagnóstico de Permissões Admin
          </h1>

          {/* Botões de Ação */}
          <div className="mb-6 space-x-4">
            <button
              onClick={runDiagnostic}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Executar Diagnóstico
            </button>
            <button
              onClick={updateUserRole}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Tentar Atualizar Role
            </button>
          </div>

          {/* Resultados dos Testes */}
          {Object.keys(testResults).length > 0 && (
            <div className="mb-6 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">Resultados dos Testes:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}

          {/* Dados do Diagnóstico */}
          {diagnosticData && (
            <div className="space-y-6">
              {/* Dados do Usuário */}
              <div className="border rounded p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  👤 Dados do Usuário
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    diagnosticData.user?.id ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {diagnosticData.user?.id ? 'OK' : 'ERRO'}
                  </span>
                </h3>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(diagnosticData.user, null, 2)}
                </pre>
              </div>

              {/* Perfil do Usuário */}
              <div className="border rounded p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  📋 Perfil do Usuário (Context)
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    diagnosticData.userProfile?.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {diagnosticData.userProfile?.role || 'SEM ROLE'}
                  </span>
                </h3>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(diagnosticData.userProfile, null, 2)}
                </pre>
              </div>

              {/* Tabela Profiles */}
              <div className="border rounded p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  🗃️ Tabela Profiles (Database)
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    diagnosticData.profilesTable?.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {diagnosticData.profilesTable?.exists ? 'EXISTE' : 'NÃO EXISTE'}
                  </span>
                </h3>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(diagnosticData.profilesTable, null, 2)}
                </pre>
                {!diagnosticData.profilesTable?.exists && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800 text-sm">
                      ⚠️ <strong>PROBLEMA ENCONTRADO:</strong> Seu perfil não existe na tabela 'profiles'. 
                      Isso causa o erro de foreign key constraint ao criar notices.
                    </p>
                  </div>
                )}
              </div>

              {/* Acesso a Notices */}
              <div className="border rounded p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  📄 Acesso à Tabela Notices
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    diagnosticData.noticesAccess?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {diagnosticData.noticesAccess?.success ? 'OK' : 'ERRO'}
                  </span>
                </h3>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(diagnosticData.noticesAccess, null, 2)}
                </pre>
              </div>

              {/* Teste de Criação */}
              <div className="border rounded p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  ✏️ Teste de Criação de Notice
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    diagnosticData.noticeCreation?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {diagnosticData.noticeCreation?.success ? 'OK' : 'ERRO'}
                  </span>
                </h3>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(diagnosticData.noticeCreation, null, 2)}
                </pre>
              </div>

              {/* Políticas RLS */}
              <div className="border rounded p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  🔒 Políticas RLS
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    diagnosticData.policies?.success ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {diagnosticData.policies?.success ? 'OK' : 'N/A'}
                  </span>
                </h3>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(diagnosticData.policies, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Instruções */}
          <div className="mt-8 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Instruções para Resolver:</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Execute o diagnóstico para ver o status atual</li>
              <li><strong>Se "Tabela Profiles" mostrar "NÃO EXISTE":</strong> Execute o SQL no Supabase para criar o perfil</li>
              <li>Se o role não for 'admin', o SQL também vai corrigir isso</li>
              <li>Faça logout e login novamente</li>
              <li>Execute o diagnóstico novamente</li>
              <li>Teste criar um aviso - deve funcionar!</li>
            </ol>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-semibold text-yellow-900 mb-1">🔧 SQL para Executar no Supabase:</h4>
              <code className="text-xs text-yellow-800 block">
                INSERT INTO profiles (id, email, name, role, active)<br/>
                SELECT id, email, email as name, 'admin' as role, true as active<br/>
                FROM auth.users WHERE email = 'hcvitor21@gmail.com'<br/>
                AND NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'hcvitor21@gmail.com');
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticAdmin;