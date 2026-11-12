'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Crea el usuario si es nuevo
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) setMessage(error.message)
    else setMessage('¡Revisa tu correo! Te enviamos un enlace mágico para ingresar.')
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-500 mb-2">SmartWorld Auditor</h1>
        <p className="text-slate-400 mb-6">Ingresa tu correo para recibir tu acceso exclusivo</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
          <button type="submit" className="w-full py-3 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-500 transition-all">
            Enviar Enlace de Acceso
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
      </div>
    </main>
  )
}