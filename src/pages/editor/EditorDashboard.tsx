import { LogOut, Save } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { StringListEditor } from '../../components/editor/StringListEditor.tsx'
import { TranslateField } from '../../components/editor/TranslateField.tsx'
import { supabase } from '../../lib/supabase.ts'
import {
  deleteExperience,
  deleteProject,
  loadEditorBundle,
  saveContentList,
  saveExperience,
  saveProject,
  saveSettings,
} from '../../services/cmsService.ts'
import type {
  ContentListRow,
  ExperienceRow,
  PortfolioBundle,
  ProjectRow,
} from '../../types/cms.ts'
import './Editor.css'

type Tab = 'profile' | 'experience' | 'lists' | 'projects' | 'contact'

function slugifyId(name: string) {
  return name
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .slice(0, 40) || `item-${Date.now()}`
}

export function EditorDashboard() {
  const [sessionReady, setSessionReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [tab, setTab] = useState<Tab>('profile')
  const [bundle, setBundle] = useState<PortfolioBundle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session))
      setSessionReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setHasSession(Boolean(session))
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await loadEditorBundle()
      setBundle(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (hasSession) void load()
  }, [hasSession, load])

  const logout = async () => {
    await supabase?.auth.signOut()
  }

  const withSave = async (fn: () => Promise<void>, okMsg: string) => {
    setSaving(true)
    setStatus(null)
    try {
      await fn()
      setStatus(okMsg)
      await load()
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  if (!sessionReady) return <div className="editor-loading">Carregando…</div>
  if (!hasSession) return <Navigate to="/editor/login" replace />

  if (loading || !bundle) {
    return <div className="editor-loading">Carregando conteúdo…</div>
  }

  const s = bundle.settings
  const competencies = bundle.lists.find((l) => l.id === 'competencies')!
  const highlights = bundle.lists.find((l) => l.id === 'highlights')!

  const updateSettings = (patch: Partial<typeof s>) =>
    setBundle({ ...bundle, settings: { ...s, ...patch } })

  const updateList = (id: string, patch: Partial<ContentListRow>) =>
    setBundle({
      ...bundle,
      lists: bundle.lists.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    })

  const updateExperience = (id: string, patch: Partial<ExperienceRow>) =>
    setBundle({
      ...bundle,
      experiences: bundle.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })

  const updateProject = (id: string, patch: Partial<ProjectRow>) =>
    setBundle({
      ...bundle,
      projects: bundle.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })

  return (
    <div className="editor-shell">
      <header className="editor-topbar">
        <div>
          <h1>Painel do portfólio</h1>
          <p>Alterações são salvas no Supabase e refletem no site público.</p>
        </div>
        <div className="editor-topbar__actions">
          <a className="editor-btn editor-btn--ghost" href="/" target="_blank" rel="noreferrer">
            Ver site
          </a>
          <button type="button" className="editor-btn editor-btn--ghost" onClick={() => void logout()}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <nav className="editor-tabs">
        {(
          [
            ['profile', 'Perfil'],
            ['experience', 'Experiência'],
            ['lists', 'Listas'],
            ['projects', 'Projetos'],
            ['contact', 'Contato'],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'is-active' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {status ? <p className="editor-status">{status}</p> : null}

      {tab === 'profile' ? (
        <section className="editor-panel card">
          <TranslateField
            label="Badge do hero"
            valuePt={s.hero_badge_pt}
            valueEn={s.hero_badge_en}
            onChangePt={(v) => updateSettings({ hero_badge_pt: v })}
            onChangeEn={(v) => updateSettings({ hero_badge_en: v })}
          />
          <TranslateField
            label="Cargo / role"
            valuePt={s.hero_role_pt}
            valueEn={s.hero_role_en}
            onChangePt={(v) => updateSettings({ hero_role_pt: v })}
            onChangeEn={(v) => updateSettings({ hero_role_en: v })}
          />
          <TranslateField
            label="Sobre"
            valuePt={s.about_text_pt}
            valueEn={s.about_text_en}
            onChangePt={(v) => updateSettings({ about_text_pt: v })}
            onChangeEn={(v) => updateSettings({ about_text_en: v })}
            multiline
            rows={5}
          />
          <TranslateField
            label="Meta title (SEO)"
            valuePt={s.meta_title_pt}
            valueEn={s.meta_title_en}
            onChangePt={(v) => updateSettings({ meta_title_pt: v })}
            onChangeEn={(v) => updateSettings({ meta_title_en: v })}
          />
          <TranslateField
            label="Meta description (SEO)"
            valuePt={s.meta_description_pt}
            valueEn={s.meta_description_en}
            onChangePt={(v) => updateSettings({ meta_description_pt: v })}
            onChangeEn={(v) => updateSettings({ meta_description_en: v })}
            multiline
            rows={2}
          />

          <h3 className="editor-subtitle">Formação</h3>
          <TranslateField
            label="Curso"
            valuePt={s.education_degree_pt}
            valueEn={s.education_degree_en}
            onChangePt={(v) => updateSettings({ education_degree_pt: v })}
            onChangeEn={(v) => updateSettings({ education_degree_en: v })}
          />
          <label className="editor-label">Instituição</label>
          <input
            className="editor-input"
            value={s.education_school}
            onChange={(e) => updateSettings({ education_school: e.target.value })}
          />
          <TranslateField
            label="Status"
            valuePt={s.education_status_pt}
            valueEn={s.education_status_en}
            onChangePt={(v) => updateSettings({ education_status_pt: v })}
            onChangeEn={(v) => updateSettings({ education_status_en: v })}
          />

          <h3 className="editor-subtitle">Skills (listas separadas por vírgula)</h3>
          {(
            [
              ['skills_frontend_list', 'Front-end'],
              ['skills_backend_list', 'Back-end'],
              ['skills_automation_list', 'Automação'],
              ['skills_other_list', 'Outros'],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="editor-label">{label}</label>
              <input
                className="editor-input"
                value={s[key]}
                onChange={(e) => updateSettings({ [key]: e.target.value })}
              />
            </div>
          ))}

          <button
            type="button"
            className="btn btn--primary"
            disabled={saving}
            onClick={() => void withSave(() => saveSettings(s), 'Perfil salvo!')}
          >
            <Save size={16} /> Salvar perfil
          </button>
        </section>
      ) : null}

      {tab === 'experience' ? (
        <section className="editor-panel">
          {bundle.experiences
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((exp) => (
              <article key={exp.id} className="editor-panel card">
                <TranslateField
                  label="Cargo"
                  valuePt={exp.role_pt}
                  valueEn={exp.role_en}
                  onChangePt={(v) => updateExperience(exp.id, { role_pt: v })}
                  onChangeEn={(v) => updateExperience(exp.id, { role_en: v })}
                />
                <label className="editor-label">Empresa</label>
                <input
                  className="editor-input"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                />
                <TranslateField
                  label="Período"
                  valuePt={exp.period_pt}
                  valueEn={exp.period_en}
                  onChangePt={(v) => updateExperience(exp.id, { period_pt: v })}
                  onChangeEn={(v) => updateExperience(exp.id, { period_en: v })}
                />
                <StringListEditor
                  label="Atividades"
                  itemsPt={exp.items_pt}
                  itemsEn={exp.items_en}
                  onChangePt={(items) => updateExperience(exp.id, { items_pt: items })}
                  onChangeEn={(items) => updateExperience(exp.id, { items_en: items })}
                />
                <div className="editor-row-actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={saving}
                    onClick={() =>
                      void withSave(() => saveExperience(exp), `Experiência ${exp.company} salva!`)
                    }
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    className="editor-btn editor-btn--danger"
                    onClick={() =>
                      void withSave(async () => {
                        await deleteExperience(exp.id)
                        setBundle({
                          ...bundle,
                          experiences: bundle.experiences.filter((e) => e.id !== exp.id),
                        })
                      }, 'Experiência removida')
                    }
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          <button
            type="button"
            className="editor-btn editor-btn--ghost"
            onClick={() => {
              const id = `exp-${Date.now()}`
              setBundle({
                ...bundle,
                experiences: [
                  ...bundle.experiences,
                  {
                    id,
                    sort_order: bundle.experiences.length,
                    role_pt: '',
                    role_en: '',
                    company: '',
                    period_pt: '',
                    period_en: '',
                    items_pt: [''],
                    items_en: [''],
                  },
                ],
              })
            }}
          >
            + Nova experiência
          </button>
        </section>
      ) : null}

      {tab === 'lists' ? (
        <section className="editor-panel card">
          <StringListEditor
            label="Competências"
            itemsPt={competencies.items_pt}
            itemsEn={competencies.items_en}
            onChangePt={(items) => updateList('competencies', { items_pt: items })}
            onChangeEn={(items) => updateList('competencies', { items_en: items })}
          />
          <StringListEditor
            label="Diferenciais"
            itemsPt={highlights.items_pt}
            itemsEn={highlights.items_en}
            onChangePt={(items) => updateList('highlights', { items_pt: items })}
            onChangeEn={(items) => updateList('highlights', { items_en: items })}
          />
          <button
            type="button"
            className="btn btn--primary"
            disabled={saving}
            onClick={() =>
              void withSave(async () => {
                await saveContentList(competencies)
                await saveContentList(highlights)
              }, 'Listas salvas!')
            }
          >
            Salvar listas
          </button>
        </section>
      ) : null}

      {tab === 'projects' ? (
        <section className="editor-panel">
          {bundle.projects
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((p) => (
              <article key={p.id} className="editor-panel card">
                <label className="editor-label">Nome</label>
                <input
                  className="editor-input"
                  value={p.name}
                  onChange={(e) => updateProject(p.id, { name: e.target.value })}
                />
                <label className="editor-label">Imagem (caminho em /public)</label>
                <input
                  className="editor-input"
                  value={p.image}
                  onChange={(e) => updateProject(p.id, { image: e.target.value })}
                />
                <label className="editor-label">GitHub</label>
                <input
                  className="editor-input"
                  value={p.github}
                  onChange={(e) => updateProject(p.id, { github: e.target.value })}
                />
                <label className="editor-label">Site</label>
                <input
                  className="editor-input"
                  value={p.site}
                  onChange={(e) => updateProject(p.id, { site: e.target.value })}
                />
                <label className="editor-label">Tecnologias (vírgula)</label>
                <input
                  className="editor-input"
                  value={p.languages.join(', ')}
                  onChange={(e) =>
                    updateProject(p.id, {
                      languages: e.target.value.split(',').map((x) => x.trim()).filter(Boolean),
                    })
                  }
                />
                <TranslateField
                  label="Descrição"
                  valuePt={p.desc_pt}
                  valueEn={p.desc_en}
                  onChangePt={(v) => updateProject(p.id, { desc_pt: v })}
                  onChangeEn={(v) => updateProject(p.id, { desc_en: v })}
                  multiline
                />
                <TranslateField
                  label="Inspiração"
                  valuePt={p.inspiration_pt}
                  valueEn={p.inspiration_en}
                  onChangePt={(v) => updateProject(p.id, { inspiration_pt: v })}
                  onChangeEn={(v) => updateProject(p.id, { inspiration_en: v })}
                  multiline
                  rows={3}
                />
                <div className="editor-row-actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={saving}
                    onClick={() => void withSave(() => saveProject(p), `Projeto ${p.name} salvo!`)}
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    className="editor-btn editor-btn--danger"
                    onClick={() =>
                      void withSave(async () => {
                        await deleteProject(p.id)
                        setBundle({
                          ...bundle,
                          projects: bundle.projects.filter((x) => x.id !== p.id),
                        })
                      }, 'Projeto removido')
                    }
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          <button
            type="button"
            className="editor-btn editor-btn--ghost"
            onClick={() => {
              const name = 'Novo projeto'
              const id = slugifyId(name)
              setBundle({
                ...bundle,
                projects: [
                  ...bundle.projects,
                  {
                    id,
                    sort_order: bundle.projects.length,
                    name,
                    image: '/Img-projetos/placeholder.svg',
                    image_alt_pt: '',
                    image_alt_en: '',
                    github: '',
                    site: '',
                    desc_pt: '',
                    desc_en: '',
                    languages: [],
                    inspiration_pt: '',
                    inspiration_en: '',
                  },
                ],
              })
            }}
          >
            + Novo projeto
          </button>
        </section>
      ) : null}

      {tab === 'contact' ? (
        <section className="editor-panel card">
          <label className="editor-label">E-mail</label>
          <input
            className="editor-input"
            value={s.email}
            onChange={(e) => updateSettings({ email: e.target.value })}
          />
          <label className="editor-label">Telefone (exibição)</label>
          <input
            className="editor-input"
            value={s.phone_display}
            onChange={(e) => updateSettings({ phone_display: e.target.value })}
          />
          <label className="editor-label">WhatsApp (URL)</label>
          <input
            className="editor-input"
            value={s.whatsapp}
            onChange={(e) => updateSettings({ whatsapp: e.target.value })}
          />
          <label className="editor-label">GitHub</label>
          <input
            className="editor-input"
            value={s.github}
            onChange={(e) => updateSettings({ github: e.target.value })}
          />
          <label className="editor-label">LinkedIn</label>
          <input
            className="editor-input"
            value={s.linkedin}
            onChange={(e) => updateSettings({ linkedin: e.target.value })}
          />
          <label className="editor-label">URL do PDF do currículo</label>
          <input
            className="editor-input"
            value={s.cv_pdf_url}
            onChange={(e) => updateSettings({ cv_pdf_url: e.target.value })}
          />
          <button
            type="button"
            className="btn btn--primary"
            disabled={saving}
            onClick={() => void withSave(() => saveSettings(s), 'Contato salvo!')}
          >
            Salvar contato
          </button>
        </section>
      ) : null}
    </div>
  )
}
