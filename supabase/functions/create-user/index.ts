import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Ensure required env vars are present
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('PROJECT_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Server misconfiguration', 
          details: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header missing' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify the user is authenticated and is admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user is admin
    const userRole = user.user_metadata?.role;
    if (userRole !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Access denied: Admin role required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { email, password, full_name, role = 'user' } = await req.json();

    // Validate required fields
    if (!email || !password || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, password, full_name' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be admin or user' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Basic validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof password !== 'string' || password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Weak password. Minimum 6 characters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists using admin listUsers (no direct getByEmail in v2)
    const { data: usersPage, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listErr) {
      console.error('Error listing users:', listErr);
    }
    const existingUser = usersPage?.users?.find(u => (u.email || '').toLowerCase() === email.toLowerCase());
    if (existingUser) {
      const existingId = existingUser.id;

      // Update user metadata to match provided fields (optional sync)
      const { error: updateMetaError } = await supabaseAdmin.auth.admin.updateUserById(existingId, {
        user_metadata: {
          role: role,
          name: full_name,
          display_name: full_name
        }
      });
      if (updateMetaError) {
        console.error('Error updating existing user metadata:', updateMetaError);
      }

      // Ensure profile exists/updated
      const { error: upsertErr } = await supabaseAdmin
        .from('user_profiles')
        .upsert([
          {
            id: existingId,
            email: email,
            full_name: full_name,
            display_name: full_name,
            role: role
          }
        ], { onConflict: 'id' });

      if (upsertErr) {
        console.error('Error upserting profile for existing user:', upsertErr);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to update existing user profile', 
            details: upsertErr.message 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'User already existed. Profile updated.',
          user: {
            id: existingId,
            email: email,
            full_name: full_name,
            role: role
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create user in Supabase Auth (let Auth generate the user_id)
    const { data: authData, error: authCreateError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: role,
        name: full_name,
        display_name: full_name
      }
    });

    if (authCreateError) {
      console.error('Error creating user in auth:', authCreateError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create user in auth', 
          details: authCreateError.message 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create/update profile in user_profiles table (idempotent upsert by id)
    const newUserId = authData?.user?.id;
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert([
        {
          id: newUserId,
          email: email,
          full_name: full_name,
          display_name: full_name,
          role: role
        }
      ], { onConflict: 'id' });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Try to clean up the auth user if profile creation failed
      if (newUserId) {
        await supabaseAdmin.auth.admin.deleteUser(newUserId);
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create user profile', 
          details: profileError.message 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'User created successfully! Can login immediately.',
        user: {
          id: newUserId,
          email: email,
          full_name: full_name,
          role: role
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
