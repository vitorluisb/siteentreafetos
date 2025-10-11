import { supabase } from '../config/supabase'

/**
 * Sets the current user as admin by updating their metadata
 * This function uses a direct RPC approach to ensure the role is properly set
 */
export const setCurrentUserAsAdmin = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('Usuário não encontrado. Faça login primeiro.')
    }

    console.log('Attempting to set user as admin:', user.email)

    // Execute RPC function to update user metadata directly
    const { data, error } = await supabase.rpc('set_user_admin_role', {
      user_email: user.email
    })

    if (error) {
      console.error('RPC function error:', error)
      
      // If RPC function doesn't exist, try direct auth update
      console.warn('RPC function failed, trying auth.updateUser...')
      
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: { role: 'admin' }
      })

      if (updateError) {
        console.error('Auth update error:', updateError)
        throw new Error(`Falha ao atualizar role: ${updateError.message}`)
      }

      return { success: true, data: updateData, method: 'auth_update' }
    }

    // Check if RPC returned success
    if (data && data.success === false) {
      throw new Error(data.error || 'Falha na função RPC')
    }

    console.log('RPC function success:', data)
    return { success: true, data, method: 'rpc' }
  } catch (error) {
    console.error('Error setting user as admin:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Checks if the current user has admin role
 */
export const checkUserRole = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { role: null, error: 'Usuário não encontrado' }
    }

    // Check user_metadata first, then raw_user_meta_data
    const role = user.user_metadata?.role || user.raw_user_meta_data?.role || null
    
    return { role, user, error: null }
  } catch (error) {
    return { role: null, error: error.message }
  }
}