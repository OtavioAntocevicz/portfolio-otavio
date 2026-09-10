import { useState } from 'react'
import { translateText } from '../../services/translateService.ts'

type Props = {
  label: string
  valuePt: string
  valueEn: string
  onChangePt: (v: string) => void
  onChangeEn: (v: string) => void
  multiline?: boolean
  rows?: number
}

export function TranslateField({
  label,
  valuePt,
  valueEn,
  onChangePt,
  onChangeEn,
  multiline = false,
  rows = 4,
}: Props) {
  const [showEn, setShowEn] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onTranslate = async () => {
    setTranslating(true)
    setError(null)
    try {
      const translated = await translateText(valuePt)
      onChangeEn(translated)
      setShowEn(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao traduzir')
    } finally {
      setTranslating(false)
    }
  }

  const Input = multiline ? 'textarea' : 'input'

  return (
    <div className="editor-field">
      <div className="editor-field__head">
        <label className="editor-label">{label}</label>
        <div className="editor-field__actions">
          <button
            type="button"
            className="editor-btn editor-btn--ghost"
            onClick={() => void onTranslate()}
            disabled={translating || !valuePt.trim()}
          >
            {translating ? 'Traduzindo…' : 'Traduzir para EN'}
          </button>
          <button
            type="button"
            className="editor-btn editor-btn--ghost"
            onClick={() => setShowEn((v) => !v)}
          >
            {showEn ? 'Ocultar EN' : 'Editar EN'}
          </button>
        </div>
      </div>
      <Input
        className="editor-input"
        value={valuePt}
        onChange={(e) => onChangePt(e.target.value)}
        rows={multiline ? rows : undefined}
      />
      {showEn ? (
        <div className="editor-field__en">
          <span className="editor-label editor-label--sub">English</span>
          <Input
            className="editor-input"
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            rows={multiline ? rows : undefined}
          />
        </div>
      ) : null}
      {error ? <p className="editor-error">{error}</p> : null}
    </div>
  )
}
