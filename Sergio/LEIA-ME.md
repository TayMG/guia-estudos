# Base de Estudos — A3 · Tema 2

Site de estudos **offline** sobre o projeto "Sistema Gerenciador de Filas Bancárias" (`Cauapm/A3---Sergio`): filas de prioridade, leis, algoritmo 2:1, código, SQL, Streamlit, testes, contradições e preparação para a banca.

## Como abrir

Dê duplo clique em `index.html`.

Não precisa de servidor, internet ou build: o site funciona direto do disco (`file://`). Se o navegador tiver alguma restrição estranha, rode um servidor local nesta pasta:

```bash
python -m http.server 8080
# abra http://localhost:8080
```

## Troca de estudo

No topo da barra lateral há duas abas:

- **Euclerio** — Kubernetes + API (Tema 1)
- **Sergio** — fila bancária + leis (Tema 2)

Elas apontam para `../Euclerio/index.html` e `../Sergio/index.html`. O tema claro/escuro é compartilhado pela chave `a3-theme`; o restante do progresso é independente por site.

## O que tem dentro

| Página | Para quê |
|---|---|
| `index.html` | visão geral em 30 segundos, contexto, lei em 60 segundos, recursos, o que está implementado × o que é promessa, checklist de domínio, números de cor e atalho de 1 hora |
| `contexto.html` | por que o projeto existe, prioridade como igualdade, o modelo TSE para o 80+ e o conflito com a starvation |
| `teoria.html` | 32 seções: fila, FIFO, multinível, deque, starvation, round-robin, cada lei, hierarquia, dataclass, IntEnum, status, gerenciador, algoritmo, traço, filas vazias, 80+, 3:2:1, complexidade, Supabase, PostgREST, pandas, Faker, `.env`, Streamlit, `session_state`, POO, testes, Git Flow e limitações |
| `arquitetura.html` | camadas, caminho de uma chamada, decisões e trade-offs, o que existe, limitações, números e arquitetura de produção |
| `pratica.html` | do zero: instalação, `.env`, schema, 500 clientes, testes, execução, simulador interativo do ciclo 2:1, Streamlit, plano B sem Supabase, erros comuns e limpeza |
| `codigo.html` | mapa dos arquivos, `modelos.py`, `aplicar_starvation`, `GerenciadorFilas`, `extracao.py`, gerador, `streamlit.py`, SQL, os 15 testes, 18 bugs e roteiro de leitura |
| `evidencias.html` | o que cada arquivo prova, o traço dos testes, PDF × código, como gerar sua própria evidência, o que não existe e demo de 3 minutos |
| `perguntas.html` | 75 perguntas com resposta de 30 segundos e aprofundamento |
| `quiz.html` | 43 questões de múltipla escolha com correção e explicação |
| `plano.html` | cronograma de 14 dias, roteiro de 15 minutos, slides, entregáveis, checklist do dia, frases de emergência, referências e ensaio |
| `banca.html` | 3:2:1 × 2:1, 80+ absoluto e o modelo TSE, starvation real, status, id/CPF, UI, SQL, LGPD, concorrência, pergunta matadora e defesa em 30 segundos |

## Recursos

- **Busca** no topo da barra lateral (atalho `/`), sem acento e sem diferenciar maiúsculas.
- **Tema claro/escuro** no rodapé da barra lateral; abre no **escuro** e salva a preferência.
- **Checklist** na página inicial: progresso salvo no navegador.
- **Botão "copiar"** em todos os blocos de código (aparece ao passar o mouse).
- **Simulador** do ciclo 80+ / 2:1 na página de prática, sem dependências.
- **Impressão**: `Ctrl+P` esconde menus e abre os acordeões — bom para gerar um PDF de revisão.

## Estrutura

```
Sergio/
├── index.html
├── contexto.html
├── teoria.html
├── arquitetura.html
├── pratica.html
├── codigo.html
├── evidencias.html
├── perguntas.html
├── quiz.html
├── plano.html
├── banca.html
├── LEIA-ME.md
└── assets/
    ├── style.css
    ├── app.js
    ├── search-data.js
    ├── quiz-data.js
    ├── quiz.js
    └── simulador.js
```

## Observação

Este site é material de estudo **local**. O repositório `Cauapm/A3---Sergio` foi apenas lido; nenhum arquivo, issue, branch ou push foi criado. As informações sobre o código vêm do clone local usado na auditoria, que não foi incluído neste site. O `repo/` dentro de `Euclerio/` é o clone do projeto de Kubernetes, não o da fila bancária.

O site não inventa prints: o repositório não tem interface implementada. As evidências são código, testes, SQL e o PDF.
