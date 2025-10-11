import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        // Handle invalid refresh token error
        if (error && error.message?.includes('Invalid Refresh Token')) {
          console.warn('Invalid refresh token detected, clearing session')
          await supabase.auth.signOut()
          setSession(null)
          setUser(null)
          setUserProfile(null)
          setLoading(false)
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Não bloquear o carregamento: iniciar fetch sem aguardar
          fetchUserProfile(session.user.id, session.user)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error getting initial session:', error)
        // Clear any corrupted session data
        setSession(null)
        setUser(null)
        setUserProfile(null)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle sign out or token refresh errors
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          if (event === 'SIGNED_OUT') {
            setSession(null)
            setUser(null)
            setUserProfile(null)
          }
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Não bloquear o carregamento: iniciar fetch sem aguardar
          fetchUserProfile(session.user.id, session.user)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId, userSession = null) => {
    try {
      // Definir perfil básico imediatamente para evitar spinner infinito
      const currentUser = userSession || user
      const basicProfile = {
        id: userId,
        email: currentUser?.email,
        name: currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0],
        display_name: currentUser?.user_metadata?.display_name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0],
        role: currentUser?.user_metadata?.role || 'user',
        active: true
      }
      setUserProfile(basicProfile)

      // Em seguida tenta carregar da tabela public.user_profiles (inclui avatar_url)
      const { data: dbProfile, error: dbError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, display_name, role, avatar_url')
        .eq('id', userId)
        .single()

      if (!dbError && dbProfile) {
        const mapped = {
          id: dbProfile.id || userId,
          email: dbProfile.email,
          name: dbProfile.full_name || dbProfile.display_name || basicProfile.name,
          display_name: dbProfile.display_name || dbProfile.full_name || basicProfile.display_name,
          role: dbProfile.role || basicProfile.role,
          avatar_url: dbProfile.avatar_url,
          active: true
        }
        setUserProfile(mapped)
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  // Função auxiliar para pegar o nome de exibição do usuário
  const getDisplayName = () => {
    return userProfile?.display_name || userProfile?.name || user?.email?.split('@')[0] || 'Usuário'
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      
      // Create the auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'admin'
          }
        }
      })

      if (authError) throw authError

      return { data: authData, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setUserProfile(null)
      setSession(null)
      
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resendConfirmation = async (email) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')

      // Update user metadata in auth
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) throw error

      // Update local profile state
      const updatedProfile = { ...userProfile, ...updates }
      setUserProfile(updatedProfile)
      
      return { data: updatedProfile, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const hasRole = (role) => {
    return userProfile?.role === role
  }

  const setUserAsAdmin = async () => {
    try {
      if (!user) throw new Error('No user logged in')

      // Update user metadata to include admin role
      const { data, error } = await supabase.auth.updateUser({
        data: { 
          ...user?.user_metadata,
          role: 'admin' 
        }
      })

      if (error) throw error

      // Update local profile state
      const updatedProfile = { ...userProfile, role: 'admin' }
      setUserProfile(updatedProfile)
      
      return { data, error: null }
    } catch (error) {
      console.error('Error setting user as admin:', error)
      return { data: null, error }
    }
  }

  const isAdmin = () => {
    return userProfile?.role === 'admin'
  }

  const isUser = () => {
    return userProfile?.role === 'user'
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
    updateProfile,
    hasRole,
    setUserAsAdmin,
    isAdmin,
    isUser,
    fetchUserProfile,
    getDisplayName
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}