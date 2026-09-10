# 🏛️ Arquitetura de Computadores — Guia de Estudo + IA

Unico arquivo HTML (`index.html`) com o guia completo, painel que gera blocos didáticos via IA (Gemini) e seção **"Blocos da turma"** com blocos compartilhados em tempo real.

## Como funciona (2 modos no MESMO arquivo)

| Modo | Quando | API Key | Blocos |
|---|---|---|---|
| **Online** | hospedado no Vercel (https) | universal, escondida no servidor | compartilhados via Upstash (todo mundo vê) |
| **Offline** | aberto direto da máquina (`file://`) | a sua, digitada no painel | locais (só você, localStorage) |

## Setup único do deploy

1. **Criar conta no Upstash** (grátis, sem cartão): https://upstash.com
   - Console → *Create Database* (Redis, região próxima) → anote:
     - **REST URL** (ex: `https://fusca-loiro-123.upstash.io`)
     - **REST Token** (gerado no console)

2. **Obter a API Key do Gemini** (grátis): https://aistudio.google.com → *Get API key*

3. **Subir no GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Guia de Arquitetura + IA"
   git remote add origin https://github.com/SEU_USUARIO/arquitetura-guia.git
   git push -u origin main
   ```

4. **Conectar no Vercel** (grátis): https://vercel.com/new → importar o repo → **Deploy**

5. **Configurar variáveis de ambiente** em Vercel:
   - Settings → Environment Variables → adicionar:
     - `GEMINI_API_KEY` → sua chave da AI Studio
     - `UPSTASH_REDIS_REST_URL` → URL REST do Upstash
     - `UPSTASH_REDIS_REST_TOKEN` → token REST do Upstash
   - Redeploy (Deployments → ⋮ → Redeploy)

6. **Pronto!** Acesse `https://SEU-PROJETO.vercel.app`. O link é o mesmo para todo mundo — qualquer bloco salvo em "Blocos da turma" aparece para todos que acessarem.

## Atualizar o conteúdo

Edite `index.html`, faça `git push` → o Vercel redeploys sozinho (~1–2 min) → todos veem.

## Estrutura

```
index.html        → guia completo + painel IA + Blocos da turma
api/gemini.js     → proxy: gera blocos (Gemini) e gerencia blocos (Upstash)
package.json      → marca o projeto como ESM
```