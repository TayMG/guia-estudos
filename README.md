# 🏛️ Arquitetura de Computadores — Guia de Estudo

Guia completo de Arquitetura de Computadores (Intel x86/x64) em um único arquivo HTML (`index.html`), com navegação lateral, diagramas e blocos de estudo salvos localmente no navegador (localStorage).

## Como funciona

| Modo | Quando | Blocos |
|---|---|---|
| **Online** | hospedado no Vercel (https) | salvos no navegador de cada visitante (localStorage, privados) |
| **Offline** | aberto direto da máquina (`file://`) | salvos no navegador (localStorage, privados) |

Não há dependência de API externa — o site é 100% estático.

## Estrutura

```
index.html        → guia completo + blocos locais (localStorage)
package.json      → (apenas para o Vercel detectar o projeto)
```

## Deploy

1. Suba este repositório no GitHub.
2. Conecte no Vercel (grátis): https://vercel.com/new → importar o repo → Deploy.
3. Pronto! Qualquer edição em `index.html` + `git push` → o Vercel redeploys automaticamente (~1–2 min).

> Este site é 100% estático e não usa nenhuma chave de API externa.