import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { translateTexts } from '../../services/translateService.ts'

type Props = {
  label: string
  itemsPt: string[]
  itemsEn: string[]
  onChangePt: (items: string[]) => void
  onChangeEn: (items: string[]) => void
}

export function StringListEditor({
  label,
  itemsPt,
  itemsEn,
  onChangePt,
  onChangeEn,
}: Props) {
  const [showEn, setShowEn] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updatePt = (index: number, value: string) => {
    const next = [...itemsPt]
    next[index] = value
    onChangePt(next)
  }

  const updateEn = (index: number, value: string) => {
    const next = [...itemsEn]
    next[index] = value
    onChangeEn(next)
  }

  const addItem = () => {
    onChangePt([...itemsPt, ''])
    onChangeEn([...itemsEn, ''])
  }

  const removeItem = (index: number) => {
    onChangePt(itemsPt.filter((_, i) => i !== index))
    onChangeEn(itemsEn.filter((_, i) => i !== index))
  }

  const onTranslateAll = async () => {
    setTranslating(true)
    setError(null)
    try {
      const translated = await translateTexts(itemsPt)
      onChangeEn(translated)
      setShowEn(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao traduzir')
    } finally {
      setTranslating(false)
    }
  }

  return (
    <div className="editor-field">
      <div className="editor-field__head">
        <label className="editor-label">{label}</label>
        <div className="editor-field__actions">
          <button
            type="button"
            className="editor-btn editor-btn--ghost"
            onClick={() => void onTranslateAll()}
            disabled={translating || !itemsPt.some((x) => x.trim())}
          >
            {translating ? 'Traduzindo…' : 'Traduzir lista EN'}
          </button>
          <button
            type="button"
            className="editor-btn editor-btn--ghost"
            onClick={() => setShowEn((v) => !v)}
          >
            {showEn ? 'Ocultar EN' : 'Editar EN'}
          </button>
          <button type="button" className="editor-btn editor-btn--ghost" onClick={addItem}>
            <Plus size={16} /> Item
          </button>
        </div>
      </div>
      <ul className="editor-list">
        {itemsPt.map((item, index) => (
          <li key={index} className="editor-list__row">
            <input
              className="editor-input"
              value={item}
              onChange={(e) => updatePt(index, e.target.value)}
              placeholder={`Item ${index + 1} (PT)`}
            />
            {showEn ? (
              <input
                className="editor-input"
                value={itemsEn[index] ?? ''}
                onChange={(e) => updateEn(index, e.target.value)}
                placeholder={`Item ${index + 1} (EN)`}
              />
            ) : null}
            <button
              type="button"
              className="editor-btn editor-btn--icon"
              onClick={() => removeItem(index)}
              aria-label="Remover item"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
      {error ? <p className="editor-error">{error}</p> : null}
    </div>
  )
}
