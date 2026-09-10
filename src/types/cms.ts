export type PortfolioSettingsRow = {
  id: string
  meta_title_pt: string
  meta_title_en: string
  meta_description_pt: string
  meta_description_en: string
  hero_badge_pt: string
  hero_badge_en: string
  hero_role_pt: string
  hero_role_en: string
  about_text_pt: string
  about_text_en: string
  skills_frontend_list: string
  skills_backend_list: string
  skills_automation_list: string
  skills_other_list: string
  education_degree_pt: string
  education_degree_en: string
  education_school: string
  education_status_pt: string
  education_status_en: string
  email: string
  phone_display: string
  phone_tel: string
  whatsapp: string
  github: string
  linkedin: string
  cv_pdf_url: string
  updated_at?: string
}

export type ExperienceRow = {
  id: string
  sort_order: number
  role_pt: string
  role_en: string
  company: string
  period_pt: string
  period_en: string
  items_pt: string[]
  items_en: string[]
  updated_at?: string
}

export type ContentListRow = {
  id: string
  items_pt: string[]
  items_en: string[]
  updated_at?: string
}

export type ProjectRow = {
  id: string
  sort_order: number
  name: string
  image: string
  image_alt_pt: string
  image_alt_en: string
  github: string
  site: string
  desc_pt: string
  desc_en: string
  languages: string[]
  inspiration_pt: string
  inspiration_en: string
  updated_at?: string
}

export type ProfileLinks = {
  email: string
  phoneDisplay: string
  phoneTel: string
  whatsapp: string
  github: string
  linkedin: string
  cvPdf: string
}

export type ProjectView = {
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

export type ExperienceView = {
  id: string
  role: string
  company: string
  period: string
  items: string[]
}

export type PortfolioView = {
  source: 'cms' | 'fallback'
  metaTitle: string
  metaDescription: string
  heroBadge: string
  heroRole: string
  aboutText: string
  skills: {
    frontendList: string
    backendList: string
    automationList: string
    otherList: string
  }
  education: {
    degree: string
    school: string
    status: string
  }
  links: ProfileLinks
  competencies: string[]
  highlights: string[]
  experiences: ExperienceView[]
  projects: ProjectView[]
}

export type PortfolioBundle = {
  settings: PortfolioSettingsRow
  experiences: ExperienceRow[]
  lists: ContentListRow[]
  projects: ProjectRow[]
}
