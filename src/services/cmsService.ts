import { supabase } from '../lib/supabase.ts'
import type {
  ContentListRow,
  ExperienceRow,
  PortfolioBundle,
  PortfolioSettingsRow,
  ProjectRow,
} from '../types/cms.ts'
import { fetchPortfolioBundle } from './portfolioService.ts'

function client() {
  if (!supabase) throw new Error('Supabase não configurado')
  return supabase
}

export async function loadEditorBundle(): Promise<PortfolioBundle> {
  return fetchPortfolioBundle()
}

export async function saveSettings(data: PortfolioSettingsRow) {
  const { error } = await client()
    .from('portfolio_settings')
    .upsert({ ...data, id: 'main' })
  if (error) throw error
}

export async function saveExperience(row: ExperienceRow) {
  const { error } = await client().from('experience_entries').upsert(row)
  if (error) throw error
}

export async function deleteExperience(id: string) {
  const { error } = await client().from('experience_entries').delete().eq('id', id)
  if (error) throw error
}

export async function saveContentList(row: ContentListRow) {
  const { error } = await client().from('content_lists').upsert(row)
  if (error) throw error
}

export async function saveProject(row: ProjectRow) {
  const { error } = await client().from('projects').upsert(row)
  if (error) throw error
}

export async function deleteProject(id: string) {
  const { error } = await client().from('projects').delete().eq('id', id)
  if (error) throw error
}

const CV_STORAGE_BUCKET = 'portfolio-assets'
const CV_STORAGE_PATH = 'cv/curriculo.pdf'

/** Envia o PDF do currículo para o Storage e devolve a URL pública. */
export async function uploadCvPdf(file: File): Promise<string> {
  if (file.type !== 'application/pdf') {
    throw new Error('Envie um arquivo PDF.')
  }
  const maxBytes = 10 * 1024 * 1024
  if (file.size > maxBytes) {
    throw new Error('O PDF deve ter no máximo 10 MB.')
  }

  const { error: uploadError } = await client()
    .storage.from(CV_STORAGE_BUCKET)
    .upload(CV_STORAGE_PATH, file, { upsert: true, contentType: 'application/pdf' })

  if (uploadError) throw uploadError

  const { data } = client().storage.from(CV_STORAGE_BUCKET).getPublicUrl(CV_STORAGE_PATH)
  return data.publicUrl
}
