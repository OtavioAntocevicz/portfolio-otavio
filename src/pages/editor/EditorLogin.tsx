import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.ts'
import './Editor.css'

export function EditorLogin() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
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
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/editor', { replace: true })
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Conta criada! Se o e-mail exigir confirmação, verifique sua caixa de entrada e depois faça login.')
        setMode('login')
      }
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

        <div className="editor-tabs editor-tabs--sm">
          <button
            type="button"
            className={mode === 'login' ? 'is-active' : ''}
            onClick={() => setMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'is-active' : ''}
            onClick={() => setMode('signup')}
          >
            Criar conta
          </button>
        </div>

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
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          {message ? <p className="editor-message">{message}</p> : null}

          <button type="submit" className="btn btn--primary editor-submit" disabled={loading}>
            {loading ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  )
}
