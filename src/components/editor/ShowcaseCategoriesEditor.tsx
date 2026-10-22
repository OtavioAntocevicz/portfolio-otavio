import { SHOWCASE_CATEGORY_DEFS } from '../../data/showcaseTech.ts'
import type { ContentListRow } from '../../types/cms.ts'
import { StringListEditor } from './StringListEditor.tsx'
import { TranslateField } from './TranslateField.tsx'

type Props = {
  lists: ContentListRow[]
  onChange: (listId: string, patch: Partial<ContentListRow>) => void
}

export function ShowcaseCategoriesEditor({ lists, onChange }: Props) {
  return (
    <div className="editor-field">
      <h3 className="editor-subtitle">Ecossistema em destaque</h3>
      <p className="editor-auth__hint">
        Categorias exibidas no bloco &quot;Ecossistema em destaque&quot; (Cloud &amp; deploy, DevTools,
        Cybersecurity, etc.).
      </p>
      {SHOWCASE_CATEGORY_DEFS.map((def) => {
        const row =
          lists.find((l) => l.id === def.listId) ?? {
            id: def.listId,
            label_pt: def.labelPt,
            label_en: def.labelEn,
            items_pt: def.itemsPt,
            items_en: def.itemsEn,
          }

        return (
          <article key={def.listId} className="editor-panel card" style={{ marginTop: '1rem' }}>
            <TranslateField
              label="Título da categoria"
              valuePt={row.label_pt ?? def.labelPt}
              valueEn={row.label_en ?? def.labelEn}
              onChangePt={(v) => onChange(def.listId, { label_pt: v })}
              onChangeEn={(v) => onChange(def.listId, { label_en: v })}
            />
            <StringListEditor
              label="Itens (chips)"
              itemsPt={row.items_pt}
              itemsEn={row.items_en}
              onChangePt={(items_pt) => onChange(def.listId, { items_pt })}
              onChangeEn={(items_en) => onChange(def.listId, { items_en })}
              onChangeBoth={(items_pt, items_en) =>
                onChange(def.listId, { items_pt, items_en })
              }
            />
          </article>
        )
      })}
    </div>
  )
}
