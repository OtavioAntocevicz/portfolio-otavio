# Portfólio Otávio — com CMS

Site de portfólio em React + Vite, com painel em `/editor` para editar currículo e projetos via Supabase.

## Desenvolvimento

```bash
cp .env.example .env
npm install
npm run dev
```

- Site público: `http://localhost:5173/`
- Editor (sem link no site): `http://localhost:5173/editor`

## CMS / Supabase

O ambiente de **desenvolvimento** já está configurado no `.env.example` (projeto `portfolio-otavio-dev`).

### Primeiro acesso ao editor

1. Abra `/editor/login`
2. Clique em **Criar conta** e registre seu e-mail e senha
3. Se o Supabase exigir confirmação de e-mail, confirme e faça login
4. Edite o conteúdo e salve — o site público lê do mesmo banco

### Tradução PT → EN

Nos campos com botão **Traduzir para EN**, a tradução usa a Edge Function `translate` (MyMemory gratuito). Para melhor qualidade, adicione `DEEPL_API_KEY` nos [Secrets do Supabase](https://supabase.com/dashboard/project/ubcebtzlsbobmxjjsoqy/settings/functions).

## Deploy (Vercel)

Na branch de preview / produção, configure as variáveis:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Valores em `.env.example`. O `vercel.json` já faz rewrite SPA para `/editor`.

**Produção (`main`)**: use um projeto Supabase separado (prod) quando for fazer merge. Enquanto valida, use apenas a preview desta branch.

## Scripts

| Comando        | Descrição        |
|----------------|------------------|
| `npm run dev`  | Servidor local   |
| `npm run build`| Build produção   |
| `npm run lint` | ESLint           |
