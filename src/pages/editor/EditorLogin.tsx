import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.ts'
import './Editor.css'

export function EditorLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setMessage('Supabase não configurado. Verifique as variáveis de ambiente.')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/editor', { replace: true })
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro de autenticação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="editor-auth">
      <div className="editor-auth__card card">
        <h1>Editor do portfólio</h1>
        <p className="editor-auth__hint">
          Acesso restrito. Use o e-mail cadastrado no Supabase Auth.
        </p>

        <form className="editor-form" onSubmit={(e) => void onSubmit(e)}>
          <label className="editor-label" htmlFor="email">E-mail</label>
          <input
            id="email"
            className="editor-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="editor-label" htmlFor="password">Senha</label>
          <input
            id="password"
            className="editor-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {message ? <p className="editor-message">{message}</p> : null}

          <button type="submit" className="btn btn--primary editor-submit" disabled={loading}>
            {loading ? 'Aguarde…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
