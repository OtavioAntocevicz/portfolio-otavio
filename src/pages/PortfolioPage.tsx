import {
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Braces,
  Check,
  Copy,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Server,
  Shield,
  Sparkles,
  Sun,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { flushSync } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { CountUp } from '../components/portfolio/CountUp.tsx'
import { LocalClock } from '../components/portfolio/LocalClock.tsx'
import { ProjectModal } from '../components/portfolio/ProjectModal.tsx'
import { RotatingBadge } from '../components/portfolio/RotatingBadge.tsx'
import { onProjectImageError } from '../components/portfolio/projectImage.ts'
import { useTheme } from '../contexts/ThemeContext.tsx'
import { usePortfolioContent } from '../hooks/usePortfolioContent.ts'
import { useReveal } from '../hooks/useReveal.ts'
import { useScrollLock } from '../hooks/useScrollLock.ts'
import { useScrollSpy } from '../hooks/useScrollSpy.ts'
import { setStoredLanguage } from '../i18n.ts'
import { mergeMarqueeSkills, SHOWCASE_CATEGORIES, showcaseItems } from '../data/showcaseTech.ts'
import { setPageMeta } from '../setPageMeta.ts'
import '../styles/portfolio.css'

const FULL_NAME = 'Otávio Morais Antocevicz'

const NAV_ITEMS = [
  { id: 'sobre', key: 'nav.about' },
  { id: 'skills', key: 'nav.skills' },
  { id: 'experiencia', key: 'nav.experience' },
  { id: 'formacao', key: 'nav.education' },
  { id: 'projetos', key: 'nav.projects' },
  { id: 'contato', key: 'nav.contact' },
] as const

const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

function splitList(list: string) {
  return list
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Separa a primeira frase para destacá-la no parágrafo "Sobre". */
function splitStatement(text: string) {
  const match = text.match(/^(.+?[.!?])\s+([\s\S]+)$/)
  if (!match) return { lead: text, rest: '' }
  return { lead: match[1], rest: match[2] }
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => unknown
}

export function PortfolioPage() {
  const { t, i18n } = useTranslation()
  const resolved = (i18n.resolvedLanguage ?? i18n.language ?? 'pt').toLowerCase()
  const lng = resolved.startsWith('en') ? 'en' : 'pt'
  const locale = lng === 'en' ? 'en-US' : 'pt-BR'

  const { theme, toggleTheme } = useTheme()
  const { content } = usePortfolioContent(lng)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24)
  const [copied, setCopied] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const firstMobileNavRef = useRef<HTMLAnchorElement>(null)
  const prevMenuOpen = useRef(menuOpen)

  const activeSection = useScrollSpy(SECTION_IDS, 'inicio')
  useScrollLock(menuOpen || activeProjectId !== null)
  useReveal(`${lng}-${content.source}-${content.projects.length}`)

  useEffect(() => {
    document.documentElement.lang = lng === 'en' ? 'en' : 'pt-BR'
    setPageMeta(content.metaTitle, content.metaDescription)
  }, [lng, content.metaTitle, content.metaDescription])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      const id = requestAnimationFrame(() => firstMobileNavRef.current?.focus())
      return () => cancelAnimationFrame(id)
    }
  }, [menuOpen])

  useEffect(() => {
    if (prevMenuOpen.current && !menuOpen) menuBtnRef.current?.focus()
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
    const mq = window.matchMedia('(min-width: 1000px)')
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    onChange()
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

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

  const onToggleTheme = (e: MouseEvent<HTMLButtonElement>) => {
    const doc = document as ViewTransitionDocument
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reduce) {
      toggleTheme()
      return
    }
    const x = e.clientX || window.innerWidth - 40
    const y = e.clientY || 40
    const r = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )
    const root = document.documentElement.style
    root.setProperty('--vt-x', `${x}px`)
    root.setProperty('--vt-y', `${y}px`)
    root.setProperty('--vt-r', `${r}px`)
    doc.startViewTransition(() => flushSync(toggleTheme))
  }

  const switchLang = (next: 'pt' | 'en') => {
    setStoredLanguage(next)
    setMenuOpen(false)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(content.links.email)
      setCopied(true)
    } catch {
      window.location.href = `mailto:${content.links.email}`
    }
  }

  const skillGroups = useMemo(
    () =>
      [
        { key: 'frontend', icon: Braces, list: content.skills.frontendList },
        { key: 'backend', icon: Server, list: content.skills.backendList },
        { key: 'automation', icon: Workflow, list: content.skills.automationList },
        { key: 'other', icon: Sparkles, list: content.skills.otherList },
      ].map((g) => ({ ...g, items: splitList(g.list) })) as {
        key: string
        icon: LucideIcon
        items: string[]
      }[],
    [content.skills],
  )

  const allSkills = useMemo(
    () => Array.from(new Set(skillGroups.flatMap((g) => g.items))),
    [skillGroups],
  )

  const marqueeSkills = useMemo(
    () => mergeMarqueeSkills(allSkills),
    [allSkills],
  )

  const showcaseCount = showcaseItems().length
  const stackCount = marqueeSkills.length

  const statement = splitStatement(content.aboutText)
  const projects = content.projects
  const activeIndex = projects.findIndex((p) => p.id === activeProjectId)
  const activeProject = activeIndex >= 0 ? projects[activeIndex] : undefined
  const year = new Date().getFullYear()

  return (
    <div className="site">
      <a className="skip-link" href="#conteudo">
        {t('a11y.skipToContent')}
      </a>

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="site-header__bar">
          <a className="brand" href="#inicio" aria-label={FULL_NAME}>
            <span className="brand__mark" aria-hidden>
              O
            </span>
            <span className="brand__text" aria-hidden>
              otávio<span>.</span>dev
            </span>
          </a>

          <nav className="nav-desktop" aria-label={t('nav.ariaMain')}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? 'true' : undefined}
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <div className="seg" role="group" aria-label={t('header.langGroup')}>
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
              className="icon-btn theme-toggle"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              ref={menuBtnRef}
              type="button"
              className="icon-btn menu-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? t('header.menuClose') : t('header.menuOpen')}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <nav aria-label={t('nav.ariaMobile')}>
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.id}
              ref={i === 0 ? firstMobileNavRef : undefined}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
            >
              <span aria-hidden>{pad(i + 1)}</span>
              {t(item.key)}
            </a>
          ))}
        </nav>
        <div className="mobile-menu__foot">
          <a href={`mailto:${content.links.email}`}>{content.links.email}</a>
          <LocalClock locale={locale} />
        </div>
      </div>

      <main id="conteudo" tabIndex={-1}>
        <section id="inicio" className="hero" aria-label={FULL_NAME}>
          <div className="hero__grid-bg" aria-hidden />
          <div className="hero__orb" aria-hidden />

          <div className="hero__inner">
            <div className="hero__meta">
              <span className="status">
                <span className="status__dot" aria-hidden />
                {content.heroBadge}
              </span>
              <span>
                {t('hero.localTime')} — <LocalClock locale={locale} />
              </span>
            </div>

            <h1 className="hero__title">
              <span className="hero__word">
                <span style={{ '--d': '0ms' } as CSSProperties}>Otávio</span>
              </span>
              <span className="hero__word">
                <span style={{ '--d': '110ms' } as CSSProperties}>Morais</span>
              </span>
              <span className="hero__word">
                <em style={{ '--d': '220ms' } as CSSProperties}>Antocevicz</em>
              </span>
            </h1>

            <div className="hero__bottom">
              <div>
                <p className="hero__role">{content.heroRole}</p>
                <div className="hero__cta">
                  <a className="btn btn--primary" href="#projetos">
                    {t('hero.ctaProjects')}
                    <ArrowUpRight size={18} aria-hidden />
                  </a>
                  <a className="btn btn--ghost" href="#contato">
                    {t('hero.ctaContact')}
                  </a>
                  <a
                    className="hero__cv"
                    href={content.links.cvPdf}
                    download="Otávio_Currículo.pdf"
                  >
                    <Download size={16} aria-hidden />
                    {t('hero.ctaCv')}
                  </a>
                </div>
              </div>
              <RotatingBadge
                text={content.heroRole}
                href="#sobre"
                label={t('hero.scroll')}
              />
            </div>
          </div>

          {marqueeSkills.length > 0 ? (
            <div className="marquee">
              <div className="marquee__track">
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    className="marquee__group"
                    aria-hidden={copy === 1 ? true : undefined}
                  >
                    {marqueeSkills.map((skill) => (
                      <li key={`${copy}-${skill}`} className="marquee__item">
                        {skill}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section id="sobre" className="section" aria-labelledby="sobre-title">
          <div className="section__inner">
            <p className="eyebrow" data-reveal>
              01 / {t('nav.about')}
            </p>
            <h2 id="sobre-title" className="sr-only">
              {t('about.title')}
            </h2>
            <p className="about__statement" data-reveal>
              <strong>{statement.lead}</strong> {statement.rest}
            </p>
            <dl className="stats" data-reveal>
              <div className="stat">
                <dd>
                  <CountUp value={content.experiences.length} />
                </dd>
                <dt>{t('about.stats.experiences')}</dt>
              </div>
              <div className="stat">
                <dd>
                  <CountUp value={projects.length} />
                </dd>
                <dt>{t('about.stats.projects')}</dt>
              </div>
              <div className="stat">
                <dd>
                  <CountUp value={stackCount} />
                  <em>+</em>
                </dd>
                <dt>{t('about.stats.tech')}</dt>
                <p className="stat__hint">{t('about.stats.techHint')}</p>
              </div>
              <div className="stat">
                <dd>
                  <CountUp value={showcaseCount} />
                </dd>
                <dt>{t('about.stats.platforms')}</dt>
                <p className="stat__hint">{t('about.stats.platformsHint')}</p>
              </div>
            </dl>
          </div>
        </section>

        <section id="skills" className="section section--muted" aria-labelledby="skills-title">
          <div className="section__inner">
            <div className="section-head" data-reveal>
              <div>
                <p className="eyebrow">02 / {t('nav.skills')}</p>
                <h2 id="skills-title" className="section-title">
                  {t('skills.title')}
                </h2>
              </div>
              <p className="section-lede">{t('skills.subtitle')}</p>
            </div>

            <div className="bento">
              {skillGroups.map((group, i) => {
                const Icon = group.icon
                return (
                  <article
                    key={group.key}
                    className={`skill-tile${i === 0 ? ' skill-tile--inverse' : ''}`}
                    data-reveal
                    style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}
                  >
                    <div className="skill-tile__head">
                      <span className="skill-tile__icon" aria-hidden>
                        <Icon size={20} />
                      </span>
                      <span>
                        {pad(i + 1)} · {pad(group.items.length)}
                      </span>
                    </div>
                    <h3>{t(`skills.${group.key}`)}</h3>
                    <ul className="chips">
                      {group.items.map((item) => (
                        <li key={item} className="chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>

            <article
              className="skill-tile skill-tile--wide skill-tile--inverse"
              data-reveal
              style={{ '--reveal-delay': '320ms' } as CSSProperties}
            >
              <div className="skill-tile__head">
                <span className="skill-tile__icon" aria-hidden>
                  <Shield size={20} />
                </span>
                <span>{t('skills.ecosystem')}</span>
              </div>
              <div className="spotlight-grid">
                {SHOWCASE_CATEGORIES.map((cat) => (
                  <div key={cat.id} className="spotlight-col">
                    <h4 className="sub-title">
                      {lng === 'en' ? cat.labelEn : cat.labelPt}
                    </h4>
                    <ul className="chips">
                      {cat.items.map((item) => (
                        <li key={item} className="chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            <div className="split">
              <div data-reveal>
                <h3 className="sub-title">{t('competencies.title')}</h3>
                <ol className="numbered">
                  {content.competencies.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
              <div data-reveal style={{ '--reveal-delay': '120ms' } as CSSProperties}>
                <h3 className="sub-title">{t('highlights.title')}</h3>
                <ul className="highlights">
                  {content.highlights.map((item) => (
                    <li key={item} className="highlight">
                      <Asterisk size={20} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="experiencia" className="section" aria-labelledby="xp-title">
          <div className="section__inner">
            <div className="section-head" data-reveal>
              <div>
                <p className="eyebrow">03 / {t('nav.experience')}</p>
                <h2 id="xp-title" className="section-title">
                  {t('experience.title')}
                </h2>
              </div>
            </div>

            <ol className="xp">
              {content.experiences.map((exp, i) => (
                <li key={exp.id} className="xp__item" data-reveal>
                  <div className="xp__side">
                    <span className="xp__num">{pad(i + 1)}</span>
                    <span className="xp__company">{exp.company}</span>
                    <span className="xp__period">{exp.period}</span>
                  </div>
                  <div>
                    <h3 className="xp__role">{exp.role}</h3>
                    <ul className="xp__list">
                      {exp.items.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="formacao"
          className="section section--tight"
          aria-labelledby="edu-title"
        >
          <div className="section__inner">
            <p className="eyebrow" data-reveal>
              04 / {t('nav.education')}
            </p>
            <article className="edu inverse" data-reveal>
              <span className="edu__icon" aria-hidden>
                <GraduationCap size={30} />
              </span>
              <div>
                <h2 id="edu-title" className="edu__degree">
                  {content.education.degree}
                </h2>
                <p className="edu__school">{content.education.school}</p>
              </div>
              <span className="edu__status">
                <span className="status__dot" aria-hidden />
                {content.education.status}
              </span>
              <span className="edu__watermark" aria-hidden>
                {content.education.school}
              </span>
            </article>
          </div>
        </section>

        <section
          id="projetos"
          className="section section--muted"
          aria-labelledby="projects-title"
        >
          <div className="section__inner">
            <div className="section-head" data-reveal>
              <div>
                <p className="eyebrow">05 / {t('nav.projects')}</p>
                <h2 id="projects-title" className="section-title">
                  {t('projects.title')}
                </h2>
              </div>
              <a
                className="btn btn--ghost projects-more"
                href={content.links.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Github size={18} aria-hidden />
                {t('projects.moreGithub')}
                <ArrowUpRight size={16} aria-hidden />
              </a>
            </div>

            <div className="projects-grid">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  id={`project-trigger-${p.id}`}
                  type="button"
                  className="project-card"
                  aria-haspopup="dialog"
                  aria-expanded={activeProjectId === p.id}
                  aria-controls={activeProjectId === p.id ? 'project-dialog' : undefined}
                  aria-label={`${p.name} — ${t('projects.cardHint')}`}
                  onClick={() => setActiveProjectId(p.id)}
                  data-reveal
                  style={{ '--reveal-delay': `${(i % 3) * 80}ms` } as CSSProperties}
                >
                  <span className="project-card__media">
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      width={800}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      onError={onProjectImageError}
                    />
                    <span className="project-card__index">{pad(i + 1)}</span>
                  </span>
                  <span className="project-card__body">
                    <span className="project-card__text">
                      <span className="project-card__name">{p.name}</span>
                      <span className="project-card__desc">{p.desc}</span>
                      <span className="project-card__stack">
                        {p.languages.slice(0, 4).map((lang) => (
                          <span key={lang} className="chip chip--sm">
                            {lang}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="project-card__arrow" aria-hidden>
                      <ArrowUpRight size={20} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="contact inverse" aria-labelledby="contact-title">
          <div className="section__inner">
            <p className="eyebrow" data-reveal>
              06 / {t('nav.contact')}
            </p>
            <h2 id="contact-title" className="contact__headline" data-reveal>
              {t('contact.headlineA')} <em>{t('contact.headlineB')}</em>
            </h2>
            <p className="contact__subtitle" data-reveal>
              {t('contact.subtitle')}
            </p>

            <div className="contact__email-row" data-reveal>
              <a className="contact__email" href={`mailto:${content.links.email}`}>
                <Mail size={28} aria-hidden />
                {content.links.email}
              </a>
              <button
                type="button"
                className={`btn btn--ghost contact__copy${copied ? ' is-copied' : ''}`}
                onClick={copyEmail}
              >
                {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                {copied ? t('contact.copied') : t('contact.copy')}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? t('contact.copied') : ''}
              </span>
            </div>

            <ul className="social" data-reveal>
              <li>
                <a href={content.links.github} target="_blank" rel="noreferrer noopener">
                  <span>
                    <Github size={20} aria-hidden />
                    {t('contact.github')}
                  </span>
                  <ArrowUpRight size={20} aria-hidden />
                </a>
              </li>
              <li>
                <a href={content.links.linkedin} target="_blank" rel="noreferrer noopener">
                  <span>
                    <Linkedin size={20} aria-hidden />
                    {t('contact.linkedin')}
                  </span>
                  <ArrowUpRight size={20} aria-hidden />
                </a>
              </li>
              <li>
                <a href={content.links.cvPdf} download="Otávio_Currículo.pdf">
                  <span>
                    <Download size={20} aria-hidden />
                    {t('hero.ctaCv')}
                  </span>
                  <ArrowUpRight size={20} aria-hidden />
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer inverse">
        <div className="footer__row">
          <span>
            © {year} {FULL_NAME}
          </span>
          <span>{t('footer.built')}</span>
          <a className="footer__top" href="#inicio">
            {t('footer.backToTop')}
            <ArrowUp size={14} aria-hidden />
          </a>
        </div>
        <p className="footer__giant" aria-hidden>
          Otávio<em>.</em>
        </p>
      </footer>

      {activeProject ? (
        <ProjectModal
          project={activeProject}
          index={activeIndex}
          fallbackGithub={content.links.github}
          onClose={closeProjectModal}
        />
      ) : null}
    </div>
  )
}
