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

A divisão de responsabilidade é intencional:

| Camada                 | Onde vive                          | Por quê                                                         |
| ---------------------- | ---------------------------------- | --------------------------------------------------------------- |
| **Conteúdo dos posts** | `src/posts/*.svx` (git)            | versionado, renderizado pelo mdsvex, sem dependência de runtime |
| **Índice dos posts**   | tabela `posts`                     | listar, buscar e filtrar precisa de consulta, não de arquivo    |
| **Tags**               | tabelas `tags` + `post_tags` (N:N) | filtrar por tag e montar a nuvem de tags                        |
| **Comentários**        | tabela `comments`                  | dado que o usuário gera — não tem lugar no git                  |
| **Contador de views**  | coluna `posts.views`               | escrita automática, incremento atômico                          |

O `.svx` continua sendo a **fonte da verdade do conteúdo**: o banco é um índice sincronizado
por `npm run db:sync` (roda também no `prebuild`). Se o banco cair, o blog continua
renderizando a partir dos arquivos — degrada, não quebra.

### Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável                | Obrigatória | Para que serve                                                                                             |
| ----------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | sim         | endpoint **pooled** (`-pooler`) do Neon — é o que a aplicação usa                                          |
| `DATABASE_URL_UNPOOLED` | para migrar | endpoint **direto** (sem `-pooler`), usado por `db:push`/`db:migrate`; se ausente, cai para `DATABASE_URL` |
| `COMMENTS_ADMIN_TOKEN`  | não         | token que autoriza remover qualquer comentário via API                                                     |
| `COMMENT_IP_SECRET`     | não         | segredo do hash de IP usado no rate limit; sem ele o rate limit fica desligado                             |

### Comandos

```bash
npm run db:start    # Postgres local via docker compose
npm run db:push     # aplica o schema (drizzle-kit push)
npm run db:migrate  # migrações versionadas
npm run db:studio   # Drizzle Studio (UI)
npm run db:sync     # sincroniza frontmatter dos .svx -> posts/tags/post_tags
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
