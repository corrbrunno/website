# corrbrunno.dev.br

Site pessoal e portfólio de Bruno Corrêa — blog, página sobre e serviços. Em desenvolvimento.

## Stack

- **SvelteKit 5** + TypeScript
- **Tailwind CSS 4** + **shadcn-svelte** (bits-ui)
- **Paraglide JS** — i18n por URL (`/en/*`), base `pt-br` sem prefixo
- **mdsvex** — posts do blog em Markdown/Svelte (`src/posts/*.svx`)
- **Drizzle ORM** + **Postgres** (Neon em produção, Docker local)
- `adapter-auto` → Vercel

## Rodando

```bash
npm install
npm run dev        # http://localhost:8443
npm run check      # svelte-check
npm run lint       # prettier + eslint
```

## Blog e banco de dados

Em runtime o banco é a **única** fonte: o blog não lê arquivo nenhum.

| Camada                 | Onde vive                                  | Por quê                                                          |
| ---------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| **Conteúdo dos posts** | `posts.body_md` + `posts.body_html`        | o app serve HTML pronto; o markdown fica guardado para re-render |
| **Metadados**          | tabela `posts`                             | listar, buscar e ordenar é consulta, não arquivo                 |
| **Tags**               | tabelas `tags` + `post_tags` (N:N)         | filtrar por tag e montar a nuvem de tags                         |
| **Comentários**        | tabela `comments`                          | dado que o usuário gera — não tem lugar no git                   |
| **Contador de views**  | coluna `posts.views` + tabela `post_views` | contador + uma linha por visitante, sem contar a mesma pessoa    |

O mdsvex continua no pipeline, mas **na escrita**: `npm run db:sync` lê os `.svx` de
`src/posts/`, compila o markdown com mdsvex e grava `body_md`/`body_html` no banco. O runtime
apenas renderiza o HTML com `{@html}`. Duas consequências: o corpo do post não pode conter
componente Svelte interativo (vira HTML estático) e editar conteúdo é editar o banco — para
reimportar dos arquivos use `npm run db:sync -- --force-body`. O import do corpo é único por
post: o que já está gravado não é sobrescrito pelos arquivos.

Com o banco fora do ar, as rotas do blog respondem **503 com mensagem** (via `+error.svelte`);
não existe mais degradação para lista vazia nem fallback para arquivo. A home continua no ar,
apenas sem a seção de posts. Ressalva conhecida: a primeira requisição falha em milissegundos,
mas quando o pool do postgres-js está tentando reconectar uma requisição seguinte pode esperar
até ~40s antes do 503.

### Postgres 18 e drizzle-kit

Use `drizzle-kit >= 0.31`. Versões anteriores não reconhecem as constraints `NOT NULL`
nomeadas do Postgres 18 (é o caso do Neon) e o `push` tenta removê-las, falhando com `42P16`
e abortando a migração inteira — inclusive as colunas novas que você queria.

### Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável                | Obrigatória | Para que serve                                                                                             |
| ----------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | sim         | endpoint **pooled** (`-pooler`) do Neon — é o que a aplicação usa                                          |
| `DATABASE_URL_UNPOOLED` | para migrar | endpoint **direto** (sem `-pooler`), usado por `db:push`/`db:migrate`; se ausente, cai para `DATABASE_URL` |
| `COMMENTS_ADMIN_TOKEN`  | não         | token que autoriza remover qualquer comentário via API                                                     |
| `VISITOR_HASH_SECRET`   | sim         | segredo do hash pseudônimo do visitante (rate limit e dedupe de views); sem ele os dois ficam desligados   |

### Comandos

```bash
npm run db:start    # Postgres local via docker compose
npm run db:push     # aplica o schema (drizzle-kit push)
npm run db:migrate  # migrações versionadas
npm run db:studio   # Drizzle Studio (UI)
npm run db:sync     # importa src/posts/*.svx -> posts/tags/post_tags + corpo renderizado
                    # (import único por post; --force-body reimporta o conteúdo)
```

### Endpoints

| Método | Rota                         | Descrição                                                    |
| ------ | ---------------------------- | ------------------------------------------------------------ |
| GET    | `/api/posts`                 | posts + contadores + tags                                    |
| GET    | `/api/posts/[slug]/comments` | comentários aprovados                                        |
| POST   | `/api/posts/[slug]/comments` | cria comentário (`{ author, body }`) → devolve `deleteToken` |
| DELETE | `/api/posts/[slug]/comments` | remove com `{ id, token }`                                   |
| GET    | `/api/posts/[slug]/views`    | leitura do contador                                          |
| POST   | `/api/posts/[slug]/views`    | incrementa o contador (1× por visita)                        |

A caixa de comentários usa **form actions** com `use:enhance` (funciona sem JavaScript) e a
mesma validação da API, em `$lib/server/comments.ts`: validação de campos, honeypot,
rate limit por IP (hash, nunca o IP cru) e token de posse para o autor remover o próprio
comentário sem login. Detalhes e decisões de segurança no histórico do repositório.

## Deploy

Vercel via `adapter-auto`. Configure as variáveis de ambiente no painel do projeto
(`DATABASE_URL` em Production, Preview e Development). Cada push na `main` gera um deploy.
