# Base de Estudos — A3 · Tema 1 (Euclerio)

Site de estudos **offline** sobre o projeto "Orquestração de serviços daemon com Kubernetes e API de gerenciamento de processos".

## Como abrir

Dê duplo clique em `index.html`.

Não precisa de servidor, internet, instalação ou build: tudo funciona direto do disco (`file://`).
Se preferir, rode um servidor local na pasta:

```bash
python -m http.server 8080
# depois abra http://localhost:8080
```

Isso não é obrigatório — só ajuda se o navegador tiver alguma restrição estranha com `file://`.

## Troca de estudo

No topo da barra lateral há duas abas:

- **Euclerio** — Kubernetes + API (Tema 1)
- **Sergio** — fila bancária + leis (Tema 2)

Elas apontam para `../Euclerio/index.html` e `../Sergio/index.html`. O tema claro/escuro é compartilhado pela chave `a3-theme`.

## O que tem dentro

| Página | Para quê |
|---|---|
| `index.html` | visão geral, mapa do projeto, cobertura do edital, checklist de domínio (básico + avançado) e números que você precisa saber de cor |
| `teoria.html` | todos os conceitos: processo, PID, sinais, daemon, namespaces, cgroups, container × VM, Docker, Kubernetes, Pod, Deployment, Service, HPA, self-healing, rede, REST, FastAPI, psutil, hostPID, probes, QoS, volumes, segurança de Pod e os demais controladores |
| `arquitetura.html` | arquitetura física e lógica, caminho de uma requisição, tabela de decisões, limitações e números medidos |
| `pratica.html` | reproduzir o ambiente do zero: API local, build, teste no Docker local, `minikube image load`, apply, acesso, self-healing, scaling, limpeza, erros comuns e diagnóstico |
| `codigo.html` | mapa de todos os arquivos, `api/main.py` e `requirements.txt`, ciclo de vida dos processos, segurança da API, os três Dockerfiles, a página do Nginx, os sete YAMLs e o que falta neles |
| `evidencias.html` | os 21 prints, o que cada um prova e qual pergunta ele responde |
| `perguntas.html` | 66 perguntas com resposta curta e aprofundamento, incluindo as pegadinhas e como responder "não sei" |
| `quiz.html` | 38 questões de múltipla escolha com correção e explicação |
| `plano.html` | cronograma de 21 dias, roteiro de 20 minutos, entregáveis, checklist do dia, frases de emergência e referências |
| `banca.html` | perguntas difíceis: mecanismo, números, contrafactuais, cálculos na lousa, defesa de cada escolha, diagnóstico ao vivo e o que responder fora do escopo |

## Recursos

- **Busca** no topo da barra lateral (atalho `/`), sem acento e sem diferenciar maiúsculas.
- **Tema claro/escuro** no rodapé da barra lateral; o site abre no **escuro por padrão** e a preferência fica salva no navegador.
- **Checklist do edital** na página inicial: o progresso fica salvo no navegador.
- **Botão "copiar"** em todos os blocos de código (aparece ao passar o mouse).
- **Impressão**: `Ctrl+P` esconde menus e abre todos os acordeões — bom para gerar um PDF de revisão.

## Estrutura

```
Euclerio/
├── index.html
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
├── repo/           (clone somente leitura do projeto original)
└── assets/
    ├── style.css
    ├── app.js
    ├── search-data.js
    ├── quiz-data.js
    └── evidencias/   (21 prints copiados do repositório)
```

## Observação

Este site é material de estudo **local**. Nada aqui foi publicado no GitHub.
Os prints em `assets/evidencias/` são cópias dos originais em `repo/docs/evidencias/`,
mantidas aqui para que o site seja autossuficiente e funcione sem o repositório ao lado.
