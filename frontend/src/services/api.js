import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
})

const TOKEN_KEY = 'trackai-auth-token'

api.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('trackai-auth-user')
      window.dispatchEvent(new Event('trackai:unauthorized'))
    }
    return Promise.reject(error)
  },
)

export const authTokenKey = TOKEN_KEY
