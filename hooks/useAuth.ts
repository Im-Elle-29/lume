'use client'
import { useEffect } from 'react'
import { getClient } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'

export function useAuth() {
  const { user, profile, loading, setUser, setProfile, setLoading, reset } = useAuthStore()
  const supabase = getClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else reset()
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  async function signInAnonymously() {
    setLoading(true)
    const { error } = await supabase.auth.signInAnonymously()
    if (error) { setLoading(false); throw error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    reset()
  }

  return { user, profile, loading, signInAnonymously, signOut }
}