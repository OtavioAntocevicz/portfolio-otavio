import {
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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'
import { useTheme } from './contexts/ThemeContext.tsx'
import { profileLinks, projectRepos } from './data/links.ts'
import i18n, { setStoredLanguage } from './i18n.ts'

type ProjectItem = { id: string; name: string; desc: string }

function App() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const lng = i18n.language.startsWith('en') ? 'en' : 'pt'

  useEffect(() => {
    document.title = t('meta.title')
    document.documentElement.lang = lng === 'en' ? 'en' : 'pt-BR'
  }, [lng, t])

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
  const projectItems = t('projects.items', {
    returnObjects: true,
  }) as ProjectItem[]

  const switchLang = (next: 'pt' | 'en') => {
    setStoredLanguage(next)
    setMenuOpen(false)
  }

  const nav = (
    <>
      <a href="#sobre" onClick={() => setMenuOpen(false)}>
        {t('nav.about')}
      </a>
      <a href="#skills" onClick={() => setMenuOpen(false)}>
        {t('nav.skills')}
      </a>
      <a href="#experiencia" onClick={() => setMenuOpen(false)}>
        {t('nav.experience')}
      </a>
      <a href="#formacao" onClick={() => setMenuOpen(false)}>
        {t('nav.education')}
      </a>
      <a href="#projetos" onClick={() => setMenuOpen(false)}>
        {t('nav.projects')}
      </a>
      <a href="#contato" onClick={() => setMenuOpen(false)}>
        {t('nav.contact')}
      </a>
    </>
  )

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <a className="header__brand" href="#top">
            Otávio
            <span className="header__brand-dot">.</span>
            dev
          </a>

          <nav className="header__nav header__nav--desktop" aria-label="Principal">
            {nav}
          </nav>

          <div className="header__actions">
            <div className="lang-toggle" role="group" aria-label="Idioma">
              <button
                type="button"
                className={lng === 'pt' ? 'is-active' : ''}
                onClick={() => switchLang('pt')}
                aria-pressed={lng === 'pt'}
              >
                PT
              </button>
              <button
                type="button"
                className={lng === 'en' ? 'is-active' : ''}
                onClick={() => switchLang('en')}
                aria-pressed={lng === 'en'}
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
        >
          <nav className="header__nav header__nav--mobile" aria-label="Mobile">
            {nav}
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
              {projectItems.map((p) => {
                const href = projectRepos[p.id] ?? profileLinks.github
                return (
                  <a
                    key={p.id}
                    className="card project-card"
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <span className="project-card__link">GitHub →</span>
                  </a>
                )
              })}
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
                <span className="contact-card__label">WhatsApp</span>
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

      <footer className="footer">
        <p>{t('footer.built')}</p>
        <p className="footer__name">© {new Date().getFullYear()} Otávio Morais Antocevicz</p>
      </footer>
    </div>
  )
}

export default App
