import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session?.user) {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, email, role, created_at, updated_at')
            .eq('id', session.user.id)
            .maybeSingle()
            
          if (profileError) {
            console.error("Profile fetch error:", profileError)
            if (mounted) setError(profileError.message)
          }
          if (mounted) {
            setSession(session)
            setUser(session.user)
            setProfile(data || null)
            setIsAdmin(data?.role === 'admin')
          }
        } else {
          if (mounted) {
            setSession(null)
            setUser(null)
            setProfile(null)
            setIsAdmin(false)
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la session:", error.message)
        if (mounted) setError(error.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      
      setLoading(true)
      
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, role, created_at, updated_at')
          .eq('id', session.user.id)
          .maybeSingle()
        
        if (error) {
          console.error("Profile fetch error:", error)
          if (mounted) setError(error.message)
        }
        if (mounted) {
          setSession(session)
          setUser(session.user)
          setProfile(data || null)
          setIsAdmin(data?.role === 'admin')
          setLoading(false)
        }
      } else {
        if (mounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
          setIsAdmin(false)
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle()
        
      if (fetchError) throw fetchError
      
      setProfile(data || null)
      setIsAdmin(data?.role === 'admin')
      setError(null)
    } catch (err) {
      console.error("Erreur refreshProfile:", err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { session, user, profile, isAdmin, loading, error, refreshProfile, signOut }
}
