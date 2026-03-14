import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/services/supabaseClient'
import { getUserProfile, createUserProfile } from '@/services/profileService'
import { UserProfile } from '@/types/inventory'
import type { User } from '@supabase/supabase-js'

interface UseAuthUserResult {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  refetchProfile: () => Promise<void>
  signOut: () => Promise<void>
}

/**
 * Hook to manage authenticated user and their profile
 * Automatically fetches user and profile on mount
 * Listens to auth state changes
 */
export function useAuthUser(): UseAuthUserResult {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserAndProfile = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError) {
        throw authError
      }

      if (!authUser) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      setUser(authUser)

      // Fetch or create user profile with OAuth metadata
      try {
        const userProfile = await getUserProfile(authUser.id)
        setProfile(userProfile)
      } catch (error) {
        // Profile doesn't exist, create it with OAuth metadata if available
        const fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || null
        const userProfile = await createUserProfile({
          id: authUser.id,
          email: authUser.email || '',
          full_name: fullName,
        })
        setProfile(userProfile)
      }
    } catch (err) {
      console.error('Error fetching user and profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load user data')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch user and profile on mount
  useEffect(() => {
    fetchUserAndProfile()
  }, [fetchUserAndProfile])

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        try {
          // Try to get existing profile
          try {
            const userProfile = await getUserProfile(session.user.id)
            setProfile(userProfile)
          } catch (error) {
            // Profile doesn't exist, create it with OAuth metadata if available
            const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || null
            const userProfile = await createUserProfile({
              id: session.user.id,
              email: session.user.email || '',
              full_name: fullName,
            })
            setProfile(userProfile)
          }
        } catch (err) {
          console.error('Error fetching profile on sign in:', err)
          setError(err instanceof Error ? err.message : 'Failed to load profile')
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const refetchProfile = useCallback(async () => {
    if (!user) return

    try {
      const userProfile = await getUserProfile(user.id)
      setProfile(userProfile)
    } catch (err) {
      console.error('Error refetching profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to reload profile')
    }
  }, [user])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (err) {
      console.error('Error signing out:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }, [])

  return {
    user,
    profile,
    loading,
    error,
    refetchProfile,
    signOut,
  }
}
