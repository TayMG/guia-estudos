# Guia da Tarefa 1 — API FastAPI + psutil

---

## 1. Objetivo

Criar uma API em Python que:
- Liste todos os processos em execução no sistema.
- Inspecione um processo específico pelo PID.
- Inicie um novo processo.
- Encerre um processo pelo PID.

A API deve rodar localmente e, depois, dentro de um container Docker com o nome `process-api:latest`.

---

## 2. O que precisa estar instalado

- WSL2 com Ubuntu
- Python 3.10 ou superior
- pip
- Docker Desktop
- Git

Se algum desses não estiver instalado, peça ajuda no grupo antes de continuar.

---

## 3. Dependências entre tarefas

**Esta guia não depende de nenhuma outra tarefa.**

**Mas a pessoa da Tarefa 3 depende desta guia:** ela precisa da imagem `process-api:latest` pronta para fazer o deploy no Kubernetes. Por isso, avise no grupo assim que a imagem estiver buildada (passo 5.6).

---

## 4. Teoria essencial

### 4.1. O que é uma API REST

**API** = Application Programming Interface. É um conjunto de regras que permite que dois programas conversem.

**REST** = Representational State Transfer. Estilo de arquitetura que usa o protocolo HTTP para trocar dados.

Em uma API REST:
- Você faz uma **requisição** para uma URL (ex: `GET /processes`).
- O servidor processa e retorna uma **resposta** (geralmente em JSON).

**Métodos HTTP:**
| Método | Uso | Exemplo no projeto |
|--------|-----|-------------------|
| GET | Buscar dados | `GET /processes` |
| POST | Criar algo | `POST /processes/start` |
| PUT | Atualizar algo | (não usado) |
| DELETE | Remover algo | `DELETE /processes/{pid}` |

**JSON** = JavaScript Object Notation. Formato de texto para trocar dados. Exemplo:
```json
{
  "pid": 123,
  "name": "nginx",
  "status": "running"
}
```

### 4.2. O que é FastAPI

**FastAPI** é um framework Python para construir APIs REST. Ele:
- Valida dados automaticamente.
- Gera documentação automática (Swagger UI em `/docs`).
- É rápido e moderno.

**Estrutura básica:**
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/rota")
def funcao():
    return {"mensagem": "olá"}
```

- `@app.get("/rota")` é um **decorator** que diz: "quando alguém fizer GET em /rota, execute essa função".
- O retorno da função vira a resposta JSON.

### 4.3. O que é psutil

**psutil** (Python System and Process Utilities) é uma biblioteca Python para inspecionar processos e recursos do sistema.

**Funções principais:**

| Função | O que faz |
|--------|-----------|
| `psutil.process_iter(['pid', 'name'])` | Itera sobre todos os processos |
| `psutil.Process(pid)` | Cria um objeto para um processo específico |
| `proc.name()` | Nome do processo |
| `proc.status()` | Status (running, sleeping, etc.) |
| `proc.cpu_percent()` | Uso de CPU |
| `proc.memory_percent()` | Uso de memória |
| `proc.cmdline()` | Linha de comando |
| `proc.terminate()` | Envia SIGTERM (educado) |
| `proc.kill()` | Envia SIGKILL (força bruta) |

### 4.4. PID, SIGTERM e SIGKILL

**PID (Process ID):** número único que identifica cada processo no Linux. PID 1 é o `init`/`systemd`.

**SIGTERM (sinal 15):** pede para o processo encerrar educadamente. O processo pode fazer cleanup antes de morrer.

**SIGKILL (sinal 9):** mata o processo à força. Não tem como o processo ignorar.

**Por que isso importa?** Na API, o endpoint `DELETE /processes/{pid}` vai usar `terminate()` por padrão e `kill()` se o parâmetro `force=true` for passado.

### 4.5. O que é um Dockerfile

Arquivo de texto com instruções para construir uma imagem Docker.

**Comandos principais:**

| Comando | O que faz |
|---------|-----------|
| `FROM` | Define a imagem base |
| `WORKDIR` | Define o diretório de trabalho dentro do container |
| `COPY` | Copia arquivos do host para a imagem |
| `RUN` | Executa um comando durante a construção |
| `EXPOSE` | Documenta a porta usada |
| `CMD` | Comando padrão ao iniciar o container |

---

## 5. Passo a passo

> **Dica de Ouro:** Para criar arquivos no terminal do Ubuntu, usaremos o editor de texto `nano`. 
> **Para salvar e sair do `nano`:** Aperte `Ctrl + O` (letra O), aperte `Enter` para confirmar, e depois `Ctrl + X` para sair.
> Se preferir, no passo 5.1 você pode digitar `code .` para abrir o VS Code e criar os arquivos por lá.

### 5.1. Criar a estrutura de pastas

No terminal do Ubuntu, digite os comandos abaixo (um por vez, apertando Enter):

```bash
# Cria a pasta do projeto e a subpasta da API
mkdir -p ~/projeto-a3/api

# Entra na pasta da API
cd ~/projeto-a3/api
```

### 5.2. Criar o arquivo `requirements.txt`

Dentro da pasta `api/`, digite:
```bash
nano requirements.txt
```
A tela vai mudar. Cole o código abaixo dentro dela:
```
fastapi==0.104.1
uvicorn==0.24.0
psutil==5.9.6
```
Salve e saia: `Ctrl + O`, `Enter`, `Ctrl + X`.

**Explicação:**
- `fastapi` → framework da API.
- `uvicorn` → servidor que roda a API.
- `psutil` → biblioteca para inspecionar processos.

### 5.3. Criar o arquivo `main.py`

Ainda na pasta `api/`, digite:
```bash
nano main.py
```
Cole o código abaixo dentro do editor:

```python
from fastapi import FastAPI, HTTPException
import psutil
import subprocess

app = FastAPI(title="Process Manager API")

@app.get("/processes")
def list_processes():
    """Lista todos os processos em execução"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'username', 'status']):
        try:
            processes.append(proc.info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return {"total": len(processes), "processes": processes}

@app.get("/processes/{pid}")
def inspect_process(pid: int):
    """Inspeciona um processo específico pelo PID"""
    try:
        proc = psutil.Process(pid)
        return {
            "pid": proc.pid,
            "name": proc.name(),
            "status": proc.status(),
            "cpu_percent": proc.cpu_percent(),
            "memory_percent": proc.memory_percent(),
            "cmdline": proc.cmdline(),
            "username": proc.username()
        }
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Processo {pid} não encontrado")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail="Acesso negado ao processo")

@app.post("/processes/start")
def start_process(command: str):
    """Inicia um novo processo"""
    try:
        proc = subprocess.Popen(command.split())
        return {"pid": proc.pid, "status": "iniciado", "command": command}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/processes/{pid}")
def terminate_process(pid: int, force: bool = False):
    """Encerra um processo pelo PID"""
    try:
        proc = psutil.Process(pid)
        if force:
            proc.kill()
        else:
            proc.terminate()
        return {"pid": pid, "status": "encerrado", "force": force}
    except psutil.NoSuchProcess:
        raise HTTPException(status_code=404, detail=f"Processo {pid} não encontrado")
    except psutil.AccessDenied:
        raise HTTPException(status_code=403, detail="Acesso negado")
```

Salve e saia: `Ctrl + O`, `Enter`, `Ctrl + X`.

**Explicação linha por linha:**

- `from fastapi import FastAPI, HTTPException` → importa o framework e a classe de erro HTTP.
- `import psutil` → importa a biblioteca de processos.
- `import subprocess` → permite iniciar processos externos.
- `app = FastAPI(...)` → cria a aplicação.
- `@app.get("/processes")` → define uma rota GET.
- `psutil.process_iter([...])` → itera sobre todos os processos, pedindo apenas os campos listados.
- `proc.info` → dicionário com as informações do processo.
- `try/except` → trata processos que morreram no meio da iteração.
- `@app.get("/processes/{pid}")` → rota com parâmetro dinâmico.
- `pid: int` → FastAPI valida que é inteiro.
- `psutil.Process(pid)` → cria objeto do processo.
- `HTTPException` → retorna erro HTTP correto (404, 403, 500).
- `@app.post("/processes/start")` → rota POST para iniciar processo.
- `subprocess.Popen(command.split())` → divide o comando e executa.
- `@app.delete("/processes/{pid}")` → rota DELETE.
- `force: bool = False` → parâmetro opcional.
- `proc.terminate()` → SIGTERM.
- `proc.kill()` → SIGKILL.

### 5.4. Testar localmente

Dentro da pasta `api/`, digite os comandos abaixo (um por vez):

```bash
# Cria o ambiente virtual (venv)
python3 -m venv venv

# Ativa o ambiente virtual
source venv/bin/activate

# Instala as dependências
pip install -r requirements.txt

# Inicia a API
uvicorn main:app --reload
```

Você verá a mensagem: `INFO: Uvicorn running on http://127.0.0.1:8000`. **Deixe este terminal aberto e rodando.**

**Abra um NOVO terminal do Ubuntu** (atalho: `Ctrl + Shift + T` ou clique no ícone de `+` do terminal) e digite os comandos para testar:

```bash
curl http://127.0.0.1:8000/processes
curl http://127.0.0.1:8000/processes/1
curl -X POST "http://127.0.0.1:8000/processes/start?command=sleep 60"
curl -X DELETE "http://127.0.0.1:8000/processes/<PID>"
```

**Abra no navegador do Windows:** `http://127.0.0.1:8000/docs`

**Para parar a API:** volte ao terminal onde ela está rodando e aperte `Ctrl+C`.

### 5.5. Criar o `Dockerfile`

Volte para o terminal da pasta `api/` e digite:
```bash
nano Dockerfile
```
Cole o código abaixo dentro do editor:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
Salve e saia: `Ctrl + O`, `Enter`, `Ctrl + X`.

**Explicação linha por linha:**

- `FROM python:3.11-slim` → imagem base com Python 3.11 (slim = mais leve).
- `WORKDIR /app` → diretório de trabalho dentro do container.
- `COPY requirements.txt .` → copia o arquivo de dependências.
- `RUN pip install ...` → instala as dependências.
- `COPY main.py .` → copia o código da API.
- `EXPOSE 8000` → documenta que o container usa a porta 8000.
- `CMD [...]` → comando que roda quando o container inicia.
- `--host 0.0.0.0` → aceita conexões de fora do container (importante!).

### 5.6. Buildar a imagem Docker

> ⚠️ **A Tarefa 3 depende deste passo.** Avise no grupo assim que a imagem estiver pronta.

Ainda na pasta `api/`, execute:
```bash
docker build -t process-api:latest .
```

**Explicação:**
- `docker build` → constrói uma imagem.
- `-t process-api:latest` → nome `process-api`, tag `latest`.
- `.` → usa o Dockerfile da pasta atual.

Verifique se a imagem foi criada:
```bash
docker images | grep process-api
```

### 5.7. Testar o container

Rode o container em background:
```bash
docker run -d -p 8000:8000 --name api-teste process-api:latest
```

**Explicação:**
- `-d` → roda em background.
- `-p 8000:8000` → mapeia a porta 8000 do host para a 8000 do container.
- `--name api-teste` → nome do container.
- `process-api:latest` → imagem usada.

Verifique se está rodando:
```bash
docker ps
```

Teste novamente (pode ser no mesmo terminal):
```bash
curl http://127.0.0.1:8000/processes
```
*(Você também pode acessar `http://127.0.0.1:8000/docs` no navegador).*

Para ver os logs do container:
```bash
docker logs api-teste
```

Ao terminar os testes, pare e remova o container:
```bash
docker stop api-teste
docker rm api-teste
```

### 5.8. Tirar prints

Tire **4 prints** para o artigo e a apresentação:

1. API rodando no terminal (`uvicorn main:app --reload`).
2. Página `/docs` no navegador.
3. Resposta do `curl /processes`.
4. Resposta do `curl /processes/1`.

Salve em `docs/evidencias/tarefa-1/`.

### 5.9. Subir para o GitHub

Volte para a pasta raiz do projeto e suba os arquivos:
```bash
cd ~/projeto-a3
git status
git checkout -b feature/api
git add api/
git commit -m "Adiciona API FastAPI com gerenciamento de processos"
git push origin feature/api
```

Depois, no GitHub:
1. Abra o repositório.
2. Clique em **Compare & pull request**.
3. Escreva uma descrição curta.
4. Clique em **Create pull request**.
5. Avise no grupo para alguém revisar.

---

## 6. Código completo (resumo dos arquivos)

### `api/requirements.txt`
```
fastapi==0.104.1
uvicorn==0.24.0
psutil==5.9.6
```

### `api/main.py`
(cole o código da seção 5.3)

### `api/Dockerfile`
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 7. Erros comuns e soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `ModuleNotFoundError: fastapi` | Dependências não instaladas | Rodar `pip install -r requirements.txt` |
| `Address already in use` | Porta 8000 ocupada | Matar o processo ou usar `--port 8001` |
| `docker: command not found` | Docker Desktop fechado | Abrir o Docker Desktop e esperar |
| `permission denied` no docker | Usuário não está no grupo docker | `sudo usermod -aG docker $USER` e reiniciar |
| `curl: (7) Failed to connect` | API não está rodando | Verificar se o uvicorn está ativo |
| `404 Not Found` em `/processes` | Rota errada ou API não reiniciou | Verificar o código e reiniciar o uvicorn |
| Container para logo após iniciar | Comando CMD errado | Verificar se o `uvicorn` está no CMD |
| `AccessDenied` ao inspecionar processo | Processo pertence a outro usuário | Normal. Retorna 403. |

---

## 8. Próximos passos

Depois de terminar:

1. Avise no grupo que a API está pronta e a imagem `process-api:latest` foi buildada.
2. A pessoa da Tarefa 3 vai usar essa imagem no Kubernetes.
3. Se a Tarefa 3 pedir ajustes, atenda e refaça o build.
4. Guarde os prints para o artigo e os slides.
