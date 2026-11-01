import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, register as registerUser, signIn, signOut } from '../services/auth.js'
import { api, authTokenKey } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleUnauthorized = () => setUser(null)
    window.addEventListener('trackai:unauthorized', handleUnauthorized)

    async function restoreSession() {
      if (!localStorage.getItem(authTokenKey)) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me')
        setUser(response.data.user)
      } catch {
        setUser(getCurrentUser())
      } finally {
        setLoading(false)
      }
    }

    void restoreSession()
    return () => window.removeEventListener('trackai:unauthorized', handleUnauthorized)
  }, [])

  const login = async credentials => {
    const nextUser = await signIn(credentials)
    setUser(nextUser)
    return nextUser
  }
  const register = async credentials => {
    const nextUser = await registerUser(credentials)
    setUser(nextUser)
    return nextUser
  }
  const logout = () => { signOut(); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
