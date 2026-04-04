import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import pt from './locales/pt.json'

const STORAGE_KEY = 'portfolio-lang'

function detectLng(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

void i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  lng: detectLng(),
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
})

export function setStoredLanguage(lng: string) {
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    /* ignore */
  }
  void i18n.changeLanguage(lng)
}

export default i18n
