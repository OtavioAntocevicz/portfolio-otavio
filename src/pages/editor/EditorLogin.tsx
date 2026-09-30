import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.ts'
import './Editor.css'

const RECOVERY_REDIRECT = `${window.location.origin}/editor/login`

export function EditorLogin() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup' | 'recovery'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [recoveryMode, setRecoveryMode] = useState(false)

  useEffect(() => {
    if (!supabase) return

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true)
        setMessage('Defina uma nova senha abaixo.')
      }
    })

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.recovery_sent_at) {
        setRecoveryMode(true)
      }
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const onForgotPassword = async () => {
    if (!supabase) {
      setMessage('Supabase não configurado.')
      return
    }
    if (!email.trim()) {
      setMessage('Informe o e-mail para recuperar a senha.')
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: RECOVERY_REDIRECT,
      })
      if (error) throw error
      setMode('recovery')
      setMessage(
        'Enviamos um link para seu e-mail. Abra o link e defina a nova senha nesta página.',
      )
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao enviar recuperação')
    } finally {
      setLoading(false)
    }
  }

  const onUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return

    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setRecoveryMode(false)
      setNewPassword('')
      setMessage('Senha atualizada! Agora você pode entrar com a nova senha.')
      setMode('login')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao atualizar senha')
    } finally {
      setLoading(false)
    }
  }

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
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage(
          'Conta criada! Se o e-mail exigir confirmação, verifique sua caixa de entrada e depois faça login.',
        )
        setMode('login')
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro de autenticação')
    } finally {
      setLoading(false)
    }
  }

  if (recoveryMode) {
    return (
      <div className="editor-auth">
        <div className="editor-auth__card card">
          <h1>Nova senha</h1>
          <p className="editor-auth__hint">Escolha uma nova senha para o editor.</p>
          <form className="editor-form" onSubmit={(e) => void onUpdatePassword(e)}>
            <label className="editor-label" htmlFor="new-password">Nova senha</label>
            <input
              id="new-password"
              className="editor-input"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
            {message ? <p className="editor-message">{message}</p> : null}
            <button type="submit" className="btn btn--primary editor-submit" disabled={loading}>
              {loading ? 'Salvando…' : 'Salvar nova senha'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="editor-auth">
      <div className="editor-auth__card card">
        <h1>Editor do portfólio</h1>
        <p className="editor-auth__hint">Acesso restrito com e-mail e senha.</p>

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

          {mode !== 'recovery' ? (
            <>
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
            </>
          ) : null}

          {message ? <p className="editor-message">{message}</p> : null}

          {mode === 'login' ? (
            <button
              type="button"
              className="editor-btn editor-btn--ghost"
              onClick={() => void onForgotPassword()}
              disabled={loading}
            >
              Esqueci minha senha
            </button>
          ) : null}

          {mode !== 'recovery' ? (
            <button type="submit" className="btn btn--primary editor-submit" disabled={loading}>
              {loading ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ) : null}
        </form>
      </div>
    </div>
  )
}
