import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Projeto dev padrão — chave anon é pública (RLS protege os dados). */
const DEFAULT_SUPABASE_URL = 'https://ubcebtzlsbobmxjjsoqy.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViY2VidHpsc2JvYm14ampzb3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMjk2OTgsImV4cCI6MjEwNDYwNTY5OH0.NdrAcCCsuCkgLjGccaKjz-rJyR22n9jG01kFUmGb_ok'

const url =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL
const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  DEFAULT_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null
