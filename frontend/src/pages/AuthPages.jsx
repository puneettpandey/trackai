import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function AuthPage({ mode }) {
  const register = mode === 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, register: createAccount } = useAuth()
  const navigate = useNavigate()

  const submit = async event => {
    event.preventDefault()
    setError('')
    if (register && !name.trim()) return setError('Please enter your name.')
    if (!email.includes('@')) return setError('Enter a valid email address.')
    if (password.length < 8) return setError('Use at least 8 characters for your password.')

    setSubmitting(true)
    try {
      const credentials = { email: email.trim(), password }
      if (register) await createAccount({ ...credentials, name: name.trim() })
      else await login(credentials)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not connect to TrackAI. Check that the backend is running and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-[#25213f] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-brand/30 blur-[90px]" /><div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-[90px]" />
        <div className="relative"><Brand light /><div className="mt-28 max-w-md"><p className="text-xs font-bold uppercase tracking-[.2em] text-violet-300">Your circle, your call</p><h1 className="mt-4 font-display text-5xl font-extrabold leading-tight">Feel a little closer to the ones you love.</h1><p className="mt-5 leading-7 text-white/60">The right people, right where they need you. Made for life's everyday check-ins.</p></div></div>
        <div className="relative flex items-center gap-3 text-sm text-white/50"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-emerald-300">✓</span> Your location. Your choice. Always.</div>
      </section>
      <section className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <div className="lg:hidden"><Brand /></div>
        <div className="mx-auto my-auto w-full max-w-[420px] py-12">
          <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand">{register ? 'Start your circle' : 'Welcome back'}</p><h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">{register ? 'Create your account' : 'Good to see you again.'}</h2><p className="mt-2 text-sm text-slate-500">{register ? 'A few details and you’re all set.' : 'Sign in to check in with your people.'}</p></div>
          <form onSubmit={submit} className="space-y-4">
            {register && <label className="block text-sm font-semibold">Your name<input required value={name} onChange={event => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-300 focus:border-brand focus:ring-4 focus:ring-brand/10" placeholder="Maya Patel" autoComplete="name" /></label>}
            <label className="block text-sm font-semibold">Email address<input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-300 focus:border-brand focus:ring-4 focus:ring-brand/10" placeholder="you@example.com" autoComplete="email" /></label>
            <label className="block text-sm font-semibold">Password<input required type="password" minLength={8} maxLength={72} value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-300 focus:border-brand focus:ring-4 focus:ring-brand/10" placeholder="At least 8 characters" autoComplete={register ? 'new-password' : 'current-password'} /></label>
            {error && <p role="alert" className="text-sm font-medium text-rose-600">{error}</p>}
            <button disabled={submitting} className="mt-2 w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-[#5148ed] disabled:cursor-wait disabled:opacity-60">{submitting ? 'Please wait…' : register ? 'Create account' : 'Log in'} <span className="ml-1">→</span></button>
          </form>
          <div className="my-6 flex items-center gap-4 text-xs text-slate-300"><span className="h-px flex-1 bg-slate-100" />SECURE ACCOUNT<span className="h-px flex-1 bg-slate-100" /></div>
          <p className="text-center text-xs leading-5 text-slate-400">Your password is securely hashed before it is stored. Use at least 8 characters.</p>
          <p className="mt-7 text-center text-sm text-slate-500">{register ? 'Already have an account?' : "Don't have an account?"} <Link className="font-bold text-brand" to={register ? '/login' : '/register'}>{register ? 'Log in' : 'Create one'}</Link></p>
          <Link to="/" className="mt-8 block text-center text-xs font-semibold text-slate-400 hover:text-ink">← Back to home</Link>
        </div>
      </section>
    </div>
  )
}

export function LoginPage() { return <AuthPage mode="login" /> }
export function RegisterPage() { return <AuthPage mode="register" /> }
