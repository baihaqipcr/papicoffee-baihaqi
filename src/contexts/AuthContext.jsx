import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [role, setRole] = useState('Guest')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCustomer = async (userId) => {
    try {
      const { data, error: customerError } = await supabase
        .from('customers')
        .select('id,nama,email,tipe_pelanggan,menu_favorit,tingkat_gula_favorit,role')
        .eq('id', userId)
        .single()

      if (customerError) {
        console.warn('Customer load error:', customerError.message)
        setCustomer(null)
        setRole('Member')
        return
      }

      setCustomer(data)
      setRole(data?.role || 'Member')
    } catch (err) {
      console.warn('Customer load failed:', err)
      setCustomer(null)
      setRole('Member')
    }
  }

  const refreshCustomer = async () => {
    if (!user?.id) return
    await loadCustomer(user.id)
  }

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      setIsLoading(true)
      try {
        const { data, error: sessionError } = await supabase.auth.getSession()
        if (!mounted) return

        if (sessionError || !data?.session) {
          setUser(null)
          setCustomer(null)
          setRole('Guest')
          setError(sessionError?.message ?? null)
          return
        }

        const currentUser = data.session.user
        setUser(currentUser)
        await loadCustomer(currentUser.id)
      } catch (err) {
        if (!mounted) return
        console.warn('Auth initialize failed:', err)
        setUser(null)
        setCustomer(null)
        setRole('Guest')
        setError(err.message)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initialize()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      if (session?.user) {
        setUser(session.user)
        await loadCustomer(session.user.id)
      } else {
        setUser(null)
        setCustomer(null)
        setRole('Guest')
      }
      setIsLoading(false)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCustomer(null)
    setRole('Guest')
  }

  const value = useMemo(
    () => ({
      user,
      customer,
      role,
      isLoading,
      error,
      refreshCustomer,
      signOut,
      isAuthenticated: !!user,
    }),
    [user, customer, role, isLoading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
