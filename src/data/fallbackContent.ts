import { profileLinks } from './links.ts'
import projectsEn from './projects.en.json'
import projectsPtBr from './projects.pt-br.json'
import en from '../locales/en.json'
import pt from '../locales/pt.json'
import type {
  ContentListRow,
  ExperienceRow,
  PortfolioBundle,
  PortfolioSettingsRow,
  PortfolioView,
  ProjectRow,
} from '../types/cms.ts'

function localeBundle(lng: 'pt' | 'en') {
  return lng === 'en' ? en : pt
}

export function getFallbackBundle(): PortfolioBundle {
  const settings: PortfolioSettingsRow = {
    id: 'main',
    meta_title_pt: pt.meta.title,
    meta_title_en: en.meta.title,
    meta_description_pt: pt.meta.description,
    meta_description_en: en.meta.description,
    hero_badge_pt: pt.hero.badge,
    hero_badge_en: en.hero.badge,
    hero_role_pt: pt.hero.role,
    hero_role_en: en.hero.role,
    about_text_pt: pt.about.text,
    about_text_en: en.about.text,
    skills_frontend_list: pt.skills.frontendList,
    skills_backend_list: pt.skills.backendList,
    skills_automation_list: pt.skills.automationList,
    skills_other_list: pt.skills.otherList,
    education_degree_pt: pt.education.degree,
    education_degree_en: en.education.degree,
    education_school: pt.education.school,
    education_status_pt: pt.education.status,
    education_status_en: en.education.status,
    email: profileLinks.email,
    phone_display: profileLinks.phoneDisplay,
    phone_tel: profileLinks.phoneTel,
    whatsapp: profileLinks.whatsapp,
    github: profileLinks.github,
    linkedin: profileLinks.linkedin,
    cv_pdf_url: profileLinks.cvPdf,
  }

  const experiences: ExperienceRow[] = [
    {
      id: 'jce',
      sort_order: 0,
      role_pt: pt.experience.jce.role,
      role_en: en.experience.jce.role,
      company: pt.experience.jce.company,
      period_pt: pt.experience.jce.period,
      period_en: en.experience.jce.period,
      items_pt: pt.experience.jce.items,
      items_en: en.experience.jce.items,
    },
    {
      id: 'polinova',
      sort_order: 1,
      role_pt: pt.experience.polinova.role,
      role_en: en.experience.polinova.role,
      company: pt.experience.polinova.company,
      period_pt: pt.experience.polinova.period,
      period_en: en.experience.polinova.period,
      items_pt: pt.experience.polinova.items,
      items_en: en.experience.polinova.items,
    },
  ]

  const lists: ContentListRow[] = [
    { id: 'competencies', items_pt: pt.competencies.items, items_en: en.competencies.items },
    { id: 'highlights', items_pt: pt.highlights.items, items_en: en.highlights.items },
  ]

  const projects: ProjectRow[] = projectsPtBr.map((p, i) => {
    const enP = projectsEn.find((x) => x.id === p.id)
    return {
      id: p.id,
      sort_order: i,
      name: p.name,
      image: p.image,
      image_alt_pt: p.imageAlt,
      image_alt_en: enP?.imageAlt ?? p.imageAlt,
      github: p.github,
      site: p.site,
      desc_pt: p.desc,
      desc_en: enP?.desc ?? p.desc,
      languages: p.languages,
      inspiration_pt: p.inspiration,
      inspiration_en: enP?.inspiration ?? p.inspiration,
    }
  })

  return { settings, experiences, lists, projects }
}

export function bundleToView(bundle: PortfolioBundle, lng: 'pt' | 'en'): PortfolioView {
  const isEn = lng === 'en'
  const s = bundle.settings

  const competencies =
    bundle.lists.find((l) => l.id === 'competencies')?.[isEn ? 'items_en' : 'items_pt'] ?? []
  const highlights =
    bundle.lists.find((l) => l.id === 'highlights')?.[isEn ? 'items_en' : 'items_pt'] ?? []

  return {
    source: 'fallback',
    metaTitle: isEn ? s.meta_title_en : s.meta_title_pt,
    metaDescription: isEn ? s.meta_description_en : s.meta_description_pt,
    heroBadge: isEn ? s.hero_badge_en : s.hero_badge_pt,
    heroRole: isEn ? s.hero_role_en : s.hero_role_pt,
    aboutText: isEn ? s.about_text_en : s.about_text_pt,
    skills: {
      frontendList: s.skills_frontend_list,
      backendList: s.skills_backend_list,
      automationList: s.skills_automation_list,
      otherList: s.skills_other_list,
    },
    education: {
      degree: isEn ? s.education_degree_en : s.education_degree_pt,
      school: s.education_school,
      status: isEn ? s.education_status_en : s.education_status_pt,
    },
    links: {
      email: s.email,
      phoneDisplay: s.phone_display,
      phoneTel: s.phone_tel,
      whatsapp: s.whatsapp,
      github: s.github,
      linkedin: s.linkedin,
      cvPdf: s.cv_pdf_url,
    },
    competencies,
    highlights,
    experiences: bundle.experiences
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((e) => ({
        id: e.id,
        role: isEn ? e.role_en : e.role_pt,
        company: e.company,
        period: isEn ? e.period_en : e.period_pt,
        items: isEn ? e.items_en : e.items_pt,
      })),
    projects: bundle.projects
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        imageAlt: isEn ? p.image_alt_en : p.image_alt_pt,
        github: p.github,
        site: p.site,
        desc: isEn ? p.desc_en : p.desc_pt,
        languages: p.languages,
        inspiration: isEn ? p.inspiration_en : p.inspiration_pt,
      })),
  }
}

export function getFallbackView(lng: 'pt' | 'en'): PortfolioView {
  const view = bundleToView(getFallbackBundle(), lng)
  return { ...view, source: 'fallback' }
}

/** UI strings still from locale files */
export function getUiLocale(lng: 'pt' | 'en') {
  return localeBundle(lng)
}
