import { ArrowUpRight, Github, X } from 'lucide-react'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProjectView } from '../../types/cms.ts'
import { onProjectImageError } from './projectImage.ts'

type Props = {
  project: ProjectView
  index: number
  fallbackGithub: string
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function ProjectModal({ project, index, fallbackGithub, onClose }: Props) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const items = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    )
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const github = project.github.trim() || fallbackGithub
  const site = project.site.trim()

  return (
    <>
      <div className="modal-backdrop" aria-hidden onClick={onClose} />
      <div
        ref={dialogRef}
        id="project-dialog"
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onKeyDown={trapFocus}
      >
        <div className="modal__top">
          <button
            ref={closeRef}
            type="button"
            className="icon-btn modal__close"
            onClick={onClose}
            aria-label={t('projects.modal.close')}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="modal__media">
          <img
            src={project.image}
            alt={project.imageAlt}
            width={1200}
            height={600}
            decoding="async"
            onError={onProjectImageError}
          />
        </div>

        <div className="modal__body">
          <div>
            <p className="eyebrow">
              {String(index + 1).padStart(2, '0')} / {t('nav.projects')}
            </p>
            <h2 id="project-modal-title" className="modal__title">
              {project.name}
            </h2>
            <p className="modal__desc">{project.desc}</p>
          </div>

          <div className="modal__grid">
            <div>
              <h3 className="modal__label">{t('projects.modal.languages')}</h3>
              <ul className="chips">
                {project.languages.map((lang) => (
                  <li key={lang} className="chip">
                    {lang}
                  </li>
                ))}
              </ul>
            </div>
            {project.inspiration.trim() ? (
              <div>
                <h3 className="modal__label">{t('projects.modal.inspiration')}</h3>
                <p className="modal__inspiration">{project.inspiration}</p>
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="modal__label">{t('projects.modal.links')}</h3>
            <div className="modal__links">
              <a
                className="btn btn--ghost"
                href={github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Github size={18} aria-hidden />
                {t('projects.modal.linkGithub')}
                <ArrowUpRight size={16} aria-hidden />
              </a>
              {site ? (
                <a
                  className="btn btn--primary"
                  href={site}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t('projects.modal.linkSite')}
                  <ArrowUpRight size={16} aria-hidden />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
