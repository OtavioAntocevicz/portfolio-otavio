import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Phone,
  Sun,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type SyntheticEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'
import { useTheme } from './contexts/ThemeContext.tsx'
import { profileLinks } from './data/links.ts'
import projectsEn from './data/projects.en.json'
import projectsPtBr from './data/projects.pt-br.json'
import { setStoredLanguage } from './i18n.ts'
import { setPageMeta } from './setPageMeta.ts'

const PROJECT_FALLBACK_IMAGE = '/Img-projetos/placeholder.svg'

function onProjectCardImageError(e: SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget
  if (el.src.includes('placeholder.svg')) return
  el.src = PROJECT_FALLBACK_IMAGE
}

type ProjectEntry = {
  id: string
  name: string
  image: string
  imageAlt: string
  github: string
  site: string
  desc: string
  languages: string[]
  inspiration: string
}

function App() {
  const { t, i18n } = useTranslation()
  const resolved =
    (i18n.resolvedLanguage ?? i18n.language ?? 'pt').toLowerCase()
  const lng = resolved.startsWith('en') ? 'en' : 'pt'

  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const projectModalCloseRef = useRef<HTMLButtonElement>(null)
  const firstMobileNavRef = useRef<HTMLAnchorElement>(null)
  const prevMenuOpen = useRef(menuOpen)

  const closeProjectModal = useCallback(() => {
    setActiveProjectId((current) => {
      if (current) {
        requestAnimationFrame(() => {
          document
            .getElementById(`project-trigger-${current}`)
            ?.focus({ preventScroll: true })
        })
      }
      return null
    })
  }, [])

  useEffect(() => {
    document.documentElement.lang = lng === 'en' ? 'en' : 'pt-BR'
    setPageMeta(t('meta.title'), t('meta.description'))
  }, [lng, t])

  useEffect(() => {
    if (menuOpen) {
      const id = requestAnimationFrame(() => firstMobileNavRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
  }, [menuOpen])

  useEffect(() => {
    if (prevMenuOpen.current && !menuOpen) {
      menuBtnRef.current?.focus()
    }
    prevMenuOpen.current = menuOpen
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const lock = menuOpen || activeProjectId !== null
    if (!lock) return

    const scrollY = window.scrollY
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
    const prevBody = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      paddingRight: document.body.style.paddingRight,
    }
    const prevHtmlOverflow = document.documentElement.style.overflow

    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    if (scrollbarGap > 0) {
      document.body.style.paddingRight = `${scrollbarGap}px`
    }
    document.documentElement.style.overflow = 'hidden'

    return () => {
      const html = document.documentElement
      const prevScrollBehavior = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'

      document.body.style.position = prevBody.position
      document.body.style.top = prevBody.top
      document.body.style.left = prevBody.left
      document.body.style.right = prevBody.right
      document.body.style.width = prevBody.width
      document.body.style.paddingRight = prevBody.paddingRight
      document.documentElement.style.overflow = prevHtmlOverflow
      window.scrollTo(0, scrollY)

      html.style.scrollBehavior = prevScrollBehavior
    }
  }, [menuOpen, activeProjectId])

  useEffect(() => {
    if (!activeProjectId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProjectModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeProjectId, closeProjectModal])

  useEffect(() => {
    if (!activeProjectId) return
    projectModalCloseRef.current?.focus()
  }, [activeProjectId])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)')
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    onChange()
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const competencyItems = t('competencies.items', {
    returnObjects: true,
  }) as string[]
  const highlightItems = t('highlights.items', {
    returnObjects: true,
  }) as string[]
  const jceItems = t('experience.jce.items', { returnObjects: true }) as string[]
  const polinovaItems = t('experience.polinova.items', {
    returnObjects: true,
  }) as string[]
  const projectItems = useMemo(
    () => (lng === 'en' ? projectsEn : projectsPtBr) as ProjectEntry[],
    [lng],
  )
  const activeProject = activeProjectId
    ? projectItems.find((p) => p.id === activeProjectId)
    : undefined

  const switchLang = (next: 'pt' | 'en') => {
    setStoredLanguage(next)
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  const navLinks = (firstRef?: RefObject<HTMLAnchorElement | null>) => (
    <>
      <a ref={firstRef} href="#sobre" onClick={closeMenu}>
        {t('nav.about')}
      </a>
      <a href="#skills" onClick={closeMenu}>
        {t('nav.skills')}
      </a>
      <a href="#experiencia" onClick={closeMenu}>
        {t('nav.experience')}
      </a>
      <a href="#formacao" onClick={closeMenu}>
        {t('nav.education')}
      </a>
      <a href="#projetos" onClick={closeMenu}>
        {t('nav.projects')}
      </a>
      <a href="#contato" onClick={closeMenu}>
        {t('nav.contact')}
      </a>
    </>
  )

  return (
    <div className="app">
      {menuOpen ? (
        <div
          className="nav-backdrop"
          aria-hidden
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <a className="skip-link" href="#top">
        {t('a11y.skipToContent')}
      </a>
      <header className="header">
        <div className="header__inner">
          <a className="header__brand" href="#top">
            Otávio
            <span className="header__brand-dot">.</span>
            dev
          </a>

          <nav
            className="header__nav header__nav--desktop"
            aria-label={t('nav.ariaMain')}
          >
            {navLinks()}
          </nav>

          <div className="header__actions">
            <div className="lang-toggle" role="group" aria-label={t('header.langGroup')}>
              <button
                type="button"
                className={lng === 'pt' ? 'is-active' : ''}
                onClick={() => switchLang('pt')}
                aria-pressed={lng === 'pt'}
                aria-label={t('header.langPt')}
              >
                PT
              </button>
              <button
                type="button"
                className={lng === 'en' ? 'is-active' : ''}
                onClick={() => switchLang('en')}
                aria-pressed={lng === 'en'}
                aria-label={t('header.langEn')}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark' ? t('header.themeLight') : t('header.themeDark')
              }
            >
              {theme === 'dark' ? (
                <Sun size={20} strokeWidth={2} />
              ) : (
                <Moon size={20} strokeWidth={2} />
              )}
            </button>

            <button
              ref={menuBtnRef}
              type="button"
              className="icon-btn header__menu-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? t('header.menuClose') : t('header.menuOpen')}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          className={`header__drawer ${menuOpen ? 'is-open' : ''}`}
          aria-hidden={!menuOpen}
          inert={!menuOpen ? true : undefined}
        >
          <nav
            className="header__nav header__nav--mobile"
            aria-label={t('nav.ariaMobile')}
          >
            {navLinks(firstMobileNavRef)}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__glow" aria-hidden />
          <p className="hero__badge">{t('hero.badge')}</p>
          <h1 className="hero__title">Otávio Morais Antocevicz</h1>
          <p className="hero__role">{t('hero.role')}</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#projetos">
              {t('hero.ctaProjects')}
            </a>
            <a className="btn btn--ghost" href="#contato">
              {t('hero.ctaContact')}
            </a>
          </div>
        </section>

        <section id="sobre" className="section">
          <div className="section__inner">
            <h2 className="section__title">{t('about.title')}</h2>
            <p className="about__text">{t('about.text')}</p>
          </div>
        </section>

        <section id="skills" className="section section--alt">
          <div className="section__inner">
            <h2 className="section__title">{t('skills.title')}</h2>
            <p className="section__subtitle">{t('skills.subtitle')}</p>
            <div className="skill-grid">
              <article className="card skill-card">
                <h3>{t('skills.frontend')}</h3>
                <p>{t('skills.frontendList')}</p>
              </article>
              <article className="card skill-card">
                <h3>{t('skills.backend')}</h3>
                <p>{t('skills.backendList')}</p>
              </article>
              <article className="card skill-card">
                <h3>{t('skills.automation')}</h3>
                <p>{t('skills.automationList')}</p>
              </article>
              <article className="card skill-card">
                <h3>{t('skills.other')}</h3>
                <p>{t('skills.otherList')}</p>
              </article>
            </div>

            <h2 className="section__title section__title--spaced">
              {t('competencies.title')}
            </h2>
            <ul className="list-check">
              {competencyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="section__title section__title--spaced">
              {t('highlights.title')}
            </h2>
            <ul className="list-dots">
              {highlightItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="experiencia" className="section">
          <div className="section__inner">
            <h2 className="section__title">{t('experience.title')}</h2>
            <ol className="timeline">
              <li className="timeline__item">
                <div className="timeline__marker" aria-hidden />
                <article className="card timeline__card">
                  <header className="timeline__head">
                    <h3>{t('experience.jce.role')}</h3>
                    <span className="timeline__company">
                      {t('experience.jce.company')}
                    </span>
                    <time className="timeline__period">
                      {t('experience.jce.period')}
                    </time>
                  </header>
                  <ul className="timeline__list">
                    {jceItems.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
              </li>
              <li className="timeline__item">
                <div className="timeline__marker" aria-hidden />
                <article className="card timeline__card">
                  <header className="timeline__head">
                    <h3>{t('experience.polinova.role')}</h3>
                    <span className="timeline__company">
                      {t('experience.polinova.company')}
                    </span>
                    <time className="timeline__period">
                      {t('experience.polinova.period')}
                    </time>
                  </header>
                  <ul className="timeline__list">
                    {polinovaItems.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
              </li>
            </ol>
          </div>
        </section>

        <section id="formacao" className="section section--alt">
          <div className="section__inner">
            <h2 className="section__title">{t('education.title')}</h2>
            <article className="card edu-card">
              <h3>{t('education.degree')}</h3>
              <p className="edu-card__school">{t('education.school')}</p>
              <span className="edu-card__status">{t('education.status')}</span>
            </article>
          </div>
        </section>

        <section id="projetos" className="section">
          <div className="section__inner">
            <h2 className="section__title">{t('projects.title')}</h2>
            <div className="project-grid">
              {projectItems.map((p) => (
                <button
                  key={p.id}
                  id={`project-trigger-${p.id}`}
                  type="button"
                  className="card project-card"
                  aria-haspopup="dialog"
                  aria-expanded={activeProjectId === p.id}
                  aria-controls="project-dialog"
                  onClick={() => setActiveProjectId(p.id)}
                >
                  <div className="project-card__media">
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      width={800}
                      height={450}
                      loading="lazy"
                      decoding="async"
                      className="project-card__img"
                      onError={onProjectCardImageError}
                    />
                  </div>
                  <div className="project-card__meta">
                    <h3>{p.name}</h3>
                    <span className="project-card__link">
                      {t('projects.cardHint')} →
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="projects-more">
              <a href={profileLinks.github} target="_blank" rel="noreferrer noopener">
                {t('projects.moreGithub')}
              </a>
            </p>
          </div>
        </section>

        <section id="contato" className="section section--alt contact">
          <div className="section__inner">
            <h2 className="section__title">{t('contact.title')}</h2>
            <p className="contact__subtitle">{t('contact.subtitle')}</p>
            <div className="contact__grid">
              <a
                className="card contact-card"
                href={`mailto:${profileLinks.email}`}
              >
                <Mail size={22} aria-hidden />
                <span className="contact-card__label">{t('contact.email')}</span>
                <span className="contact-card__value">{profileLinks.email}</span>
              </a>
              <a
                className="card contact-card"
                href={`tel:${profileLinks.phoneTel}`}
              >
                <Phone size={22} aria-hidden />
                <span className="contact-card__label">{t('contact.phone')}</span>
                <span className="contact-card__value">
                  {profileLinks.phoneDisplay}
                </span>
              </a>
              <a
                className="card contact-card"
                href={profileLinks.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
              >
                <MessageCircle size={22} aria-hidden />
                <span className="contact-card__label">{t('contact.whatsapp')}</span>
                <span className="contact-card__value">
                  {profileLinks.phoneDisplay}
                </span>
              </a>
              <a
                className="card contact-card"
                href={profileLinks.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Github size={22} aria-hidden />
                <span className="contact-card__label">{t('contact.github')}</span>
                <span className="contact-card__value">github.com</span>
              </a>
              <a
                className="card contact-card"
                href={profileLinks.linkedin}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Linkedin size={22} aria-hidden />
                <span className="contact-card__label">
                  {t('contact.linkedin')}
                </span>
                <span className="contact-card__value">LinkedIn</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {activeProject ? (
        <>
          <div
            className="project-modal-backdrop"
            aria-hidden
            onClick={closeProjectModal}
          />
          <div
            id="project-dialog"
            className="project-modal card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <header className="project-modal__head">
              <h2 id="project-modal-title" className="project-modal__title">
                {activeProject.name}
              </h2>
              <button
                ref={projectModalCloseRef}
                type="button"
                className="icon-btn project-modal__close"
                onClick={closeProjectModal}
                aria-label={t('projects.modal.close')}
              >
                <X size={22} strokeWidth={2} />
              </button>
            </header>
            <div className="project-modal__body">
              <p className="project-modal__desc">{activeProject.desc}</p>

              <section className="project-modal__block" aria-labelledby="pm-lang">
                <h3 id="pm-lang" className="project-modal__label">
                  {t('projects.modal.languages')}
                </h3>
                <ul className="project-modal__tags">
                  {activeProject.languages.map((lang) => (
                    <li key={lang}>{lang}</li>
                  ))}
                </ul>
              </section>

              <section className="project-modal__block" aria-labelledby="pm-links">
                <h3 id="pm-links" className="project-modal__label">
                  {t('projects.modal.links')}
                </h3>
                <div className="project-modal__links">
                  <a
                    className="btn btn--ghost project-modal__ext"
                    href={activeProject.github.trim() || profileLinks.github}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Github size={18} aria-hidden />
                    {t('projects.modal.linkGithub')}
                    <ExternalLink size={16} className="project-modal__ext-ico" aria-hidden />
                  </a>
                  {activeProject.site.trim() ? (
                    <a
                      className="btn btn--ghost project-modal__ext"
                      href={activeProject.site.trim()}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {t('projects.modal.linkSite')}
                      <ExternalLink size={16} className="project-modal__ext-ico" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </section>

              <section className="project-modal__block" aria-labelledby="pm-insp">
                <h3 id="pm-insp" className="project-modal__label">
                  {t('projects.modal.inspiration')}
                </h3>
                <p className="project-modal__inspiration">{activeProject.inspiration}</p>
              </section>
            </div>
          </div>
        </>
      ) : null}

      <footer className="footer">
        <p>{t('footer.built')}</p>
        <p className="footer__name">© {new Date().getFullYear()} Otávio Morais Antocevicz</p>
      </footer>
    </div>
  )
}

export default App
