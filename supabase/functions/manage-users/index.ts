import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Prepare clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('PROJECT_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Server misconfiguration', details: 'SUPABASE_URL or SERVICE_ROLE_KEY not set' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Admin client (service role) for auth.admin and bypassing RLS on tables
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // User-context client using Authorization header for any user-context operations
    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { method } = req;
    const url = new URL(req.url);
    const path = url.pathname;

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const userRole = user.user_metadata?.role || 'user';
    if (userRole !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle different operations
    switch (method) {
      case 'GET':
        return await handleGetUsers(supabaseAdmin, corsHeaders);
      
      case 'POST':
        return await handleCreateUser(req, supabaseAdmin, corsHeaders);
      
      case 'PUT':
        return await handleUpdateUser(req, supabaseAdmin, corsHeaders);
      
      case 'DELETE':
        return await handleDeleteUser(req, supabaseAdmin, corsHeaders);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleGetUsers(supabaseClient, corsHeaders) {
  try {
    // Get users from auth.users
    const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
    
    if (authError) throw authError;

    // Get profiles from user_profiles
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('user_profiles')
      .select('*');

    if (profilesError) throw profilesError;

    // Combine data
    const usersWithProfiles = authUsers.users.map(authUser => {
      const profile = profiles.find(p => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        full_name: profile?.full_name || authUser.user_metadata?.name || '',
        display_name: profile?.display_name || authUser.user_metadata?.display_name || '',
        role: profile?.role || authUser.user_metadata?.role || 'user',
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        email_confirmed_at: authUser.email_confirmed_at,
        active: !authUser.banned_until
      };
    });

    return new Response(
      JSON.stringify({ users: usersWithProfiles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting users:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleCreateUser(req, supabaseClient, corsHeaders) {
  try {
    const { email, password, full_name, role } = await req.json();

    if (!email || !password || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: full_name,
        role: role || 'user',
        display_name: full_name
      },
      email_confirm: true
    });

    if (authError) throw authError;

    return new Response(
      JSON.stringify({ user: authData.user, message: 'User created successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleUpdateUser(req, supabaseClient, corsHeaders) {
  try {
    const { userId, full_name, role } = await req.json();

    if (!userId || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update user metadata in Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          name: full_name,
          role: role || 'user',
          display_name: full_name
        }
      }
    );

    if (authError) throw authError;

    // Update profile in user_profiles table
    const { error: profileError } = await supabaseClient
      .from('user_profiles')
      .update({
        full_name,
        role: role || 'user',
        display_name: full_name,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    return new Response(
      JSON.stringify({ user: authData.user, message: 'User updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function handleDeleteUser(req, supabaseClient, corsHeaders) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing user ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete user from Supabase Auth using admin client
    const { error } = await supabaseClient.auth.admin.deleteUser(userId);

    // Se usuário não existir no Auth, continuar com a limpeza do perfil
    if (error) {
      const msg = (error?.message || '').toLowerCase();
      const isNotFound = msg.includes('not found') || msg.includes('não encontrado');
      if (!isNotFound) {
        throw error;
      }
      console.warn(`Auth user ${userId} não encontrado; prosseguindo com limpeza de perfil.`);
    }

    // Best-effort cleanup in user_profiles using admin client (bypass RLS)
    const { error: profileDeleteError } = await supabaseClient
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (profileDeleteError) {
      // Log but don't fail the whole operation
      console.error('Error deleting profile:', profileDeleteError.message);
    }

    return new Response(
      JSON.stringify({ message: error ? 'Perfil excluído; usuário de Auth não encontrado' : 'User deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
