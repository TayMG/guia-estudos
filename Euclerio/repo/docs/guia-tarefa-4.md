# Guia da Tarefa 4 — Documentação

---

## 1. Objetivo

Escrever o artigo, montar os slides, criar o README e o roteiro da apresentação.

---

## 2. O que precisa estar instalado

- WSL2 com Ubuntu
- Git
- Editor de texto (VS Code, nano ou similar)
- Conta no GitHub
- LibreOffice ou PowerPoint (para os slides)
- Navegador web

Se algum desses não estiver instalado, peça ajuda no grupo antes de continuar.

---

## 3. Dependências entre tarefas

| Passo | Depende de | O que precisa |
|-------|-----------|---------------|
| 4.1 (escrever Introdução e Teoria) | Ninguém | Pode fazer desde o Dia 1 |
| 4.2 (escrever Projeto) | Tarefa 1, 2 e 3 | Prints e descrição das partes |
| 4.3 (escrever Resultados) | Tarefa 3 | Tabela de resultados + prints + vídeos |
| 4.4 (escrever Conclusão) | Tarefa 3 | Resultados para basear a conclusão |
| 4.6 (montar slides) | Todas | Prints e informações de todas as partes |

**Estratégia:** comece pelo que **não depende de ninguém** (passo 4.1). Depois, quando as outras tarefas entregarem, você preenche o resto.

**Aviso:** você é a pessoa que **cobra** as entregas das outras tarefas. Se alguém atrasar, avise o grupo e, se necessário, o professor.

---

## 4. Passo a passo

### 4.1. Escrever Introdução e Embasamento Teórico

> ✅ **Este passo não depende de ninguém.** Pode ser feito desde o Dia 1.

Crie `docs/artigo.md` com a estrutura inicial:

```markdown
# Orquestração de Serviços Daemon com Kubernetes e API de Gerenciamento de Processos

**Data:** ____/____/2026

---

## 1. Introdução

[Escrever aqui]

---

## 2. Embasamento Teórico

[Escrever aqui]

---

## 3. Projeto

[Escrever aqui]

---

## 4. Resultados

[Escrever aqui]

---

## 5. Conclusão

[Escrever aqui]

---

## 6. Anexos

[Escrever aqui]
```

**O que escrever na Introdução (2–3 parágrafos):**
- Contextualize: containers e Kubernetes estão cada vez mais presentes no mercado.
- Problema: gerenciar processos em ambientes distribuídos é desafiador.
- Objetivo: construir um ambiente com 3 containers orquestrados pelo Kubernetes, com uma API que gerencia processos.
- Justificativa: aplicar conceitos de Organização de Computadores e Sistemas Operacionais.

**O que escrever no Embasamento Teórico (3–5 páginas):**
- **Daemon:** definição, características, exemplos.
- **Container vs. VM:** diferenças, vantagens.
- **Docker:** imagem, container, Dockerfile.
- **Kubernetes:** arquitetura, componentes, Pod, Deployment, Service, ReplicaSet.
- **Self-healing:** como funciona.
- **Scaling e HPA:** como funciona.
- **FastAPI:** o que é, para que serve.
- **psutil:** o que é, para que serve.
- **PID, SIGTERM, SIGKILL:** conceitos do Linux.

Use o material teórico das guias 1, 2 e 3 como base. Copie, cole e adapte.

### 4.2. Escrever a seção Projeto

> ⚠️ **Depende da Tarefa 1, 2 e 3.** Você precisa dos prints e descrições.

**O que escrever (3–4 páginas):**

- **Descrição geral:** o que o projeto faz.
- **Arquitetura:** diagrama mostrando os 3 containers, o Service, o namespace.
- **API FastAPI:**
  - Endpoints (tabela).
  - Prints do `/docs` e das respostas.
  - Explicação do uso de psutil.
- **Containers:**
  - Dockerfile do Nginx + Cron.
  - Dockerfile do Cron separado.
  - Prints do `docker ps`.
- **Kubernetes:**
  - YAMLs principais (Deployment, Service, HPA).
  - Prints do `kubectl get pods/svc/hpa`.
  - Explicação do `hostPID`.

**Peça à Tarefa 1, 2 e 3:**
- Prints das suas partes (eles salvam em `docs/evidencias/tarefa-X/`).
- Descrição curta do que fizeram.

### 4.3. Escrever a seção Resultados

> ⚠️ **Depende da Tarefa 3.** Você precisa da tabela de resultados e dos vídeos.

**O que escrever (2–3 páginas):**

- **Self-healing:**
  - Como foi demonstrado (deletar pod → recriação automática).
  - Tempo de recriação.
  - Print ou frame do vídeo.
- **Scaling:**
  - Como foi demonstrado (gerar carga → réplicas aumentam).
  - Tabela com réplicas antes/depois.
  - Print do `kubectl get hpa`.
- **Análise:**
  - O Kubernetes se comportou como esperado?
  - Houve algum problema?
  - O que poderia ser melhorado?

Use a tabela de resultados que a Tarefa 3 montou.

### 4.4. Escrever a Conclusão

> ⚠️ **Depende da Tarefa 3.** Precisa dos resultados.

**O que escrever (1–2 páginas):**

- **Aprendizados:** o que o grupo aprendeu sobre Kubernetes, containers, FastAPI, etc.
- **Limitações:** o que não foi possível fazer.
- **Trabalhos futuros:**
  - Adicionar mais serviços.
  - Usar Helm para gerenciar os YAMLs.
  - Integrar CI/CD.
  - Usar um cluster real (não só Minikube).
  - Implementar monitoramento com Prometheus + Grafana.

### 4.5. Escrever os Anexos

**O que incluir:**

- Slides (link ou cópia).
- Roteiro de instalação e configuração.
- Prompt e nome usados na LLM (se aplicável).
- Arquivos de configuração (YAMLs, Dockerfiles).

**Roteiro de instalação:**
- Liste os passos para reproduzir o projeto do zero.
- Inclua os comandos exatos.
- Referencie as guias de cada tarefa.

### 4.6. Montar os slides

> ⚠️ **Depende de todas.** Precisa dos prints e informações de todas as partes.

**Ferramenta:** PowerPoint, LibreOffice Impress ou Google Slides.

**Estrutura:** 12 slides.

| Slide | Conteúdo |
|-------|----------|
| 1 | Capa |
| 2 | Introdução (tema, objetivo) |
| 3 | Embasamento teórico (daemon, container, Kubernetes) |
| 4 | Arquitetura do sistema (diagrama) |
| 5 | API FastAPI (endpoints, prints) |
| 6 | Containers (Dockerfiles, prints) |
| 7 | Kubernetes (Deployments, Services, YAMLs) |
| 8 | Self-healing (demonstração) |
| 9 | Scaling (demonstração) |
| 10 | Resultados e métricas |
| 11 | Conclusão e trabalhos futuros |
| 12 | Referências |

**Regras de design:**
- Fonte grande (mínimo 24pt).
- Pouco texto por slide.
- Use os prints das evidências.
- Use um diagrama para a arquitetura.
- Cores consistentes.

**Salve como PDF:** `docs/slides.pdf`.

### 4.7. Escrever o README.md

Crie `README.md` na raiz com:

```markdown
# Projeto A3 — Tema 1

**Orquestração de Serviços Daemon com Kubernetes e API de Gerenciamento de Processos**

## Descrição

Ambiente com 3 containers (API FastAPI, Nginx com cron, Cron separado) orquestrados pelo Kubernetes. Demonstra self-healing e scaling.

## Estrutura do repositório

(cole a estrutura de pastas)

## Como rodar

1. Buildar as imagens:
   ```bash
   cd api && docker build -t process-api:latest .
   cd ../nginx && docker build -t nginx-cron:latest .
   cd ../cron && docker build -t cron-daemon:latest .
   ```

2. Iniciar o Minikube:
   ```bash
   minikube start --driver=docker
   minikube image load process-api:latest
   minikube image load nginx-cron:latest
   minikube image load cron-daemon:latest
   ```

3. Aplicar os YAMLs:
   ```bash
   kubectl apply -f k8s/
   ```

4. Acessar a API:
   ```bash
   curl http://$(minikube ip):30080/processes
   ```

## Documentação

- [Interfaces](docs/interfaces.md)
- [Tarefas](docs/tarefas.md)
- [Artigo](docs/artigo.md)
- [Slides](docs/slides.pdf)
```

### 4.8. Escrever o roteiro de apresentação

> ⚠️ **Depende de todas.** Precisa das informações de todas as partes.

Crie `docs/roteiro-apresentacao.md` com:

```markdown
# Roteiro da Apresentação

**Duração total:** 20 minutos

(Escrever aqui a divisão de tempo, quem fala o quê, e observações para o dia)
```

### 4.9. Enviar para o professor

**Prazo:** 25/11/2026.

**E-mail:** euclerio.filho@ulife.com.br

**Anexos:**
- Artigo em PDF ou DOCX.
- Slides em PDF.
- Roteiro de instalação e configuração.
- Prompt e nome usados na LLM (se aplicável).
- Arquivos de configuração (YAMLs, Dockerfiles) — ou link do GitHub.

**Assunto:** `Projeto A3 — Tema 1 — [Nome do grupo]`

**Corpo:** texto curto explicando que é a entrega e listando os anexos.

---

## 5. Modelos prontos

### 5.1. Estrutura do artigo

```markdown
# Título do Projeto

## 1. Introdução
- Contexto
- Problema
- Objetivo
- Justificativa

## 2. Embasamento Teórico
- Daemon
- Container vs. VM
- Docker
- Kubernetes
- Self-healing
- Scaling e HPA
- FastAPI
- psutil

## 3. Projeto
- Descrição geral
- Arquitetura
- API FastAPI
- Containers
- Kubernetes

## 4. Resultados
- Self-healing
- Scaling
- Análise

## 5. Conclusão
- Aprendizados
- Limitações
- Trabalhos futuros

## 6. Anexos
- Slides
- Roteiro de instalação
- Arquivos de configuração
```

### 5.2. Roteiro de instalação

```markdown
# Roteiro de Instalação e Configuração

## 1. Ambiente
- WSL2 com Ubuntu
- Docker Desktop
- Minikube
- kubectl
- Python 3.10+
- Git

## 2. Clonar o repositório
git clone https://github.com/<usuario>/projeto-a3.git
cd projeto-a3

## 3. Buildar as imagens
cd api && docker build -t process-api:latest .
cd ../nginx && docker build -t nginx-cron:latest .
cd ../cron && docker build -t cron-daemon:latest .

## 4. Iniciar o Minikube
minikube start --driver=docker
minikube image load process-api:latest
minikube image load nginx-cron:latest
minikube image load cron-daemon:latest

## 5. Aplicar os YAMLs
kubectl apply -f k8s/

## 6. Acessar a API
curl http://$(minikube ip):30080/processes
```

---

## 6. Próximos passos

Depois de terminar:

1. Confirme que todas as tarefas enviaram suas partes.
2. Confirme que todos os prints e vídeos estão em `docs/evidencias/`.
3. Confirme que o artigo está completo.
4. Confirme que os slides estão em PDF.
5. Confirme que o roteiro está pronto.
6. Envie tudo para o professor até 25/11/2026.
