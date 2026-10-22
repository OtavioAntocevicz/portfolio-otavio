import { FileUp } from 'lucide-react'
import { useRef, useState } from 'react'
import { uploadCvPdf } from '../../services/cmsService.ts'

type Props = {
  currentUrl: string
  disabled?: boolean
  onUploaded: (publicUrl: string) => void
}

export function CvPdfUpload({ currentUrl, disabled, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onPick = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadCvPdf(file)
      onUploaded(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao enviar o PDF')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="editor-field">
      <label className="editor-label">Currículo (PDF)</label>
      <p className="editor-auth__hint">
        Envie o PDF aqui; o link de download no site usa esta URL. Você não precisa mais colocar o
        arquivo manualmente em <code>public/</code>.
      </p>
      {currentUrl ? (
        <p className="editor-status">
          <a href={currentUrl} target="_blank" rel="noreferrer">Abrir PDF atual</a>
        </p>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        disabled={disabled || uploading}
        onChange={(e) => void onPick(e.target.files?.[0])}
      />
      <button
        type="button"
        className="editor-btn editor-btn--ghost"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
      >
        <FileUp size={16} /> {uploading ? 'Enviando…' : 'Selecionar e enviar PDF'}
      </button>
      {error ? <p className="editor-error">{error}</p> : null}
    </div>
  )
}
