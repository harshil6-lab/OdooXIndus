import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/services/supabaseClient'
import { getUserProfile, getOrCreateProfile } from '@/services/profileService'
import { UserProfile } from '@/types/inventory'
import type { User } from '@supabase/supabase-js'

interface UseAuthUserResult {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  refetchProfile: () => Promise<void>
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

      // Fetch or create user profile
      const userProfile = await getOrCreateProfile(authUser.id, authUser.email || '')
      setProfile(userProfile)
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
          const userProfile = await getOrCreateProfile(session.user.id, session.user.email || '')
          setProfile(userProfile)
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

  return {
    user,
    profile,
    loading,
    error,
    refetchProfile,
  }
}
