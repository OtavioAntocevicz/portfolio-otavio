import { supabase } from '../lib/supabase.ts'

export async function translateText(text: string): Promise<string> {
  if (!text.trim()) return ''
  if (!supabase) throw new Error('Supabase não configurado')

  const { data, error } = await supabase.functions.invoke('translate', {
    body: { text },
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return String(data.translated ?? '')
}

export async function translateTexts(texts: string[]): Promise<string[]> {
  if (!texts.length) return []
  if (!supabase) throw new Error('Supabase não configurado')

  const { data, error } = await supabase.functions.invoke('translate', {
    body: { texts },
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)

  const translated = data.translated
  if (Array.isArray(translated)) return translated.map(String)
  return [String(translated)]
}
