import { api, authTokenKey } from './api.js'

const AUTH_USER_KEY = 'trackai-auth-user'

export function getCurrentUser() {
  const stored = localStorage.getItem(AUTH_USER_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch (error) {
    if (error instanceof SyntaxError) {
      localStorage.removeItem(AUTH_USER_KEY)
      localStorage.removeItem(authTokenKey)
      return null
    }
    throw error
  }
}

export async function signIn(credentials) {
  const response = await api.post('/auth/login', credentials)
  saveSession(response.data)
  return response.data.user
}

export async function register(credentials) {
  const response = await api.post('/auth/register', credentials)
  saveSession(response.data)
  return response.data.user
}

function saveSession({ token, user }) {
  localStorage.setItem(authTokenKey, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function signOut() {
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(authTokenKey)
}
