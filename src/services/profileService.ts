import { supabase } from '@/services/supabaseClient'
import { UserProfile, CreateProfileInput, UpdateProfileInput } from '@/types/inventory'

/**
 * Get the current authenticated user from Supabase Auth
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error)
    throw new Error(error.message)
  }
  
  if (!user) {
    throw new Error('No authenticated user found')
  }
  
  return user
}

/**
 * Get user profile from profiles table
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('Profile not found')
  }

  return data as UserProfile
}

/**
 * Create a new user profile
 */
export async function createUserProfile(input: CreateProfileInput): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: input.id,
      email: input.email,
      full_name: input.full_name ?? null,
      company_name: input.company_name ?? null,
      role: input.role ?? null,
    })
    .select('*')
    .single()

  if (error) {
    console.error('Error creating user profile:', error)
    throw new Error(error.message)
  }

  return data as UserProfile
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: input.full_name ?? null,
      company_name: input.company_name ?? null,
      role: input.role ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating user profile:', error)
    throw new Error(error.message)
  }

  return data as UserProfile
}

/**
 * Get or create user profile (useful for ensuring profile exists)
 */
export async function getOrCreateProfile(userId: string, email: string): Promise<UserProfile> {
  try {
    return await getUserProfile(userId)
  } catch (error) {
    // Profile doesn't exist, create it
    return await createUserProfile({
      id: userId,
      email,
    })
  }
}
