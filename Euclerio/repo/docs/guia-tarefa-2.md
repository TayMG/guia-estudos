# Guia da Tarefa 2 — Containers Nginx e Cron

---

## 1. Objetivo

Criar dois containers Docker:
- **Nginx com cron embutido:** servidor web que também executa tarefas agendadas.
- **Cron separado:** container dedicado apenas a executar tarefas agendadas.

Os containers devem ser buildados com os nomes `nginx-cron:latest` e `cron-daemon:latest`.

---

## 2. O que precisa estar instalado

- WSL2 com Ubuntu
- Docker Desktop
- Git

Se algum desses não estiver instalado, peça ajuda no grupo antes de continuar.

---

## 3. Dependências entre tarefas

**Esta guia não depende de nenhuma outra tarefa.**

**Mas a pessoa da Tarefa 3 depende desta guia:** ela precisa das imagens `nginx-cron:latest` e `cron-daemon:latest` prontas para fazer o deploy no Kubernetes. Por isso, avise no grupo assim que as imagens estiverem buildadas (passo 5.6).

---

## 4. Teoria essencial

### 4.1. O que é um daemon

**Daemon** é um programa que roda em segundo plano, sem interface visual e sem estar ligado a um terminal. Ele fica "esperando" para executar tarefas de forma contínua ou sob demanda.

**Características:**
- Roda em background (sem janela, sem tela).
- Sem terminal associado: se o usuário desliga o terminal, o daemon continua rodando.
- Iniciado geralmente no boot do sistema.
- Nome termina com "d" por convenção: `sshd`, `crond`, `httpd`, `dockerd`.

**No seu projeto:**
- **Nginx** é um daemon: servidor web que responde requisições HTTP.
- **Cron** é um daemon: agendador que executa tarefas em horários definidos.

### 4.2. O que é Nginx

**Nginx** é um servidor web de alta performance. Ele:
- Recebe requisições HTTP.
- Responde com conteúdo estático (HTML, imagens, etc.).
- Pode atuar como proxy reverso e balanceador de carga.

No seu projeto, o Nginx serve como exemplo de daemon rodando dentro de um container.

### 4.3. O que é Cron

**Cron** é um agendador de tarefas do Linux. Ele lê um arquivo chamado `crontab` e executa comandos em horários definidos.

**Formato do crontab:**
```
* * * * * comando
│ │ │ │ │
│ │ │ │ └── dia da semana (0-7, 0=domingo)
│ │ │ └──── mês (1-12)
│ │ └────── dia do mês (1-31)
│ └──────── hora (0-23)
└────────── minuto (0-59)
```

**Exemplos:**
- `* * * * *` → a cada minuto.
- `0 * * * *` → a cada hora (no minuto 0).
- `0 0 * * *` → todo dia à meia-noite.

**No seu projeto:** a tarefa cron escreve a data atual em um arquivo de log a cada minuto.

### 4.4. Por que cron precisa rodar em foreground

Containers são projetados para rodar **um processo principal em foreground**. Se esse processo termina, o container para.

O cron, por padrão, roda em background (daemon). Se você rodar `crond` sem a flag `-f`, ele "solta" o terminal e o container entende que o processo principal terminou → o container morre.

**Solução:** usar `crond -f` (foreground). Assim, o cron fica como processo principal do container e o container não morre.

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

### 4.6. O que é uma imagem Alpine

**Alpine** é uma distribuição Linux extremamente leve (cerca de 5 MB). É muito usada em containers por ser pequena e rápida.

No seu projeto, você vai usar:
- `nginx:alpine` → Nginx sobre Alpine.
- `alpine:latest` → Alpine puro para o container de cron.

**Diferença importante:** Alpine usa `apk` como gerenciador de pacotes (em vez de `apt` do Ubuntu). Para instalar o cron no Alpine, usa-se `apk add dcron`.

---

## 5. Passo a passo

> **Dica de Ouro:** Para criar arquivos no terminal do Ubuntu, usaremos o editor de texto `nano`. 
> **Para salvar e sair do `nano`:** Aperte `Ctrl + O` (letra O), aperte `Enter` para confirmar, e depois `Ctrl + X` para sair.
> Se preferir, você pode digitar `code .` para abrir o VS Code e criar os arquivos por lá.

### 5.1. Criar a estrutura de pastas

No terminal (WSL2/Ubuntu), execute os comandos abaixo para criar a pasta do projeto e as subpastas de uma vez:

```bash
mkdir -p ~/projeto-a3/nginx ~/projeto-a3/cron
cd ~/projeto-a3/nginx
```

### 5.2. Criar o Dockerfile do Nginx

Você tem **duas opções** para o Nginx. Escolha **apenas uma** das opções abaixo (recomendamos a Opção B para impressionar na apresentação).

#### Opção A: Versão Básica (Apenas a página padrão do Nginx)
Abra o editor de texto:
```bash
nano Dockerfile
```
Cole o código abaixo:
```dockerfile
FROM nginx:alpine

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'busybox crond -b -l 8 -c /etc/crontabs' >> /entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

RUN echo "* * * * * date >> /var/log/cron.log" > /etc/crontabs/root

CMD ["/entrypoint.sh"]
```
Salve e saia: `Ctrl + O`, `Enter`, `Ctrl + X`.

#### Opção B: Versão com Site Personalizado (Recomendado)
Se você quer que o site mostre o nome do projeto e o log do cron em tempo real, siga os passos abaixo.

**1. Criar a pasta e o arquivo HTML:**
Ainda dentro da pasta `nginx/`, crie a pasta html e o arquivo index:
```bash
mkdir -p html
nano html/index.html
```
Cole o código HTML abaixo dentro do editor:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Projeto A3 - Daemon</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 50px; background-color: #f4f4f9; }
        h1 { color: #333; }
        .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
        iframe { width: 100%; height: 150px; border: 1px solid #ccc; border-radius: 4px; background: #fff; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Projeto A3 - Tema 1</h1>
        <h2>Nginx + Cron Daemon</h2>
        <p>Status: <strong>Servidor Nginx rodando!</strong></p>
        <p>Log do Cron em tempo real (atualiza a cada minuto):</p>
        
        <!-- O iframe vai ler o arquivo cron.txt que o Nginx vai servir -->
        <iframe src="cron.txt" title="Log do Cron"></iframe>
    </div>
</body>
</html>
```
Salve e saia: `Ctrl + O`, `Enter`, `Ctrl + X`.

**2. Criar o Dockerfile do Nginx para o site:**
```bash
nano Dockerfile
```
Atualize o seu Dockerfile para ficar exatamente assim (usando o busybox e a extensão .txt):
```dockerfile
FROM nginx:alpine

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'busybox crond -b -l 8 -c /etc/crontabs' >> /entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# O log agora vai para a pasta do site com extensão .txt
RUN echo "* * * * * date >> /usr/share/nginx/html/cron.txt" > /etc/crontabs/root

# Copia a nossa pasta html para dentro do container
COPY html /usr/share/nginx/html

CMD ["/entrypoint.sh"]
```
Salve e saia: `Ctrl + O`, `Enter`, `Ctrl + X`.

### 5.3. Criar o entrypoint.sh (opcional)

Se preferir separar o script do Dockerfile (em vez de usar os comandos `echo` no passo anterior), crie o arquivo:
```bash
nano entrypoint.sh
```
Cole o código:
```bash
#!/bin/sh
busybox crond -b -l 8 -c /etc/crontabs
nginx -g "daemon off;"
```
Salve e saia (`Ctrl + O`, `Enter`, `Ctrl + X`).

Se você fizer isso, precisará alterar o Dockerfile para copiar esse arquivo (substituindo as linhas de `echo` por `COPY entrypoint.sh /entrypoint.sh` e `RUN chmod +x /entrypoint.sh`). **Recomendação:** para facilitar, ignore o passo 5.3 e apenas use o Dockerfile do passo 5.2.

### 5.4. Criar o Dockerfile do Cron separado

Volte para a pasta raiz do projeto, entre na pasta do cron e abra o editor:
```bash
cd ~/projeto-a3/cron
nano Dockerfile
```
Cole o código abaixo dentro do editor:

```dockerfile
FROM alpine:latest

RUN echo "* * * * * date >> /var/log/cron-task.log" > /etc/crontabs/root

CMD ["busybox", "crond", "-f", "-l", "8", "-c", "/etc/crontabs"]
```
Salve e saia: `Ctrl + O`, `Enter`, `Ctrl + X`.

**Explicação linha por linha:**

- `FROM alpine:latest` → imagem base Alpine pura.
- `RUN echo "* * * * * date >> ..." > /etc/crontabs/root` → cria a tarefa que escreve a data no log a cada minuto.
- `CMD ["busybox", "crond", "-f", "-l", "8", "-c", "/etc/crontabs"]` → inicia o cron nativo do Alpine em **foreground** (`-f`).

> ⚠️ **Observação sobre alteração no código:**
> A linha `RUN apk add --no-cache dcron` foi removida do Dockerfile do Cron. 
> **Motivo:** o pacote `dcron` apresenta um erro de permissão (`setpgid: Operation not permitted`) ao rodar dentro de containers Docker modernos, o que fazia o container morrer logo após iniciar. 
> **Solução:** passamos a usar o cron nativo que já vem instalado na imagem Alpine (via BusyBox), alterando o `CMD` para `["busybox", "crond", "-f", "-l", "8", "-c", "/etc/crontabs"]`. O funcionamento é exatamente o mesmo e resolve o problema de compatibilidade.

### 5.5. Criar o arquivo crontab (opcional)

Se quiser documentar a tarefa separadamente (apenas para consulta, não é lido pelo Dockerfile), crie:
```bash
nano crontab
```
Cole:
```
* * * * * date >> /var/log/cron-task.log
```
Salve e saia (`Ctrl + O`, `Enter`, `Ctrl + X`).

### 5.6. Buildar as imagens

> ⚠️ **A Tarefa 3 depende deste passo.** Avise no grupo assim que as imagens estiverem prontas.

**Para buildar a imagem do Nginx:**
```bash
cd ~/projeto-a3/nginx
docker build -t nginx-cron:latest .
```

**Para buildar a imagem do Cron:**
```bash
cd ~/projeto-a3/cron
docker build -t cron-daemon:latest .
```

**Explicação:**
- `docker build` → constrói uma imagem.
- `-t nginx-cron:latest` → nome `nginx-cron`, tag `latest`.
- `-t cron-daemon:latest` → nome `cron-daemon`, tag `latest`.
- `.` → usa o Dockerfile da pasta atual.

Verifique se as duas imagens foram criadas:
```bash
docker images | grep -E "nginx-cron|cron-daemon"
```

### 5.7. Testar os containers

**1. Testar o container do Nginx:**
Rode o container em background:
```bash
docker run -d -p 8080:80 --name nginx-teste nginx-cron:latest
```

Verifique se está rodando:
```bash
docker ps
```
Abra no navegador do Windows: `http://127.0.0.1:8080` (deve aparecer a página "Welcome to nginx!" ou o site personalizado se você fez a Opção B).

Para ver se o cron do Nginx está funcionando (espere 1 minuto e rode o comando correspondente à sua versão):
*   **Se você fez a Opção A (Básica):**
    ```bash
    docker exec nginx-teste cat /var/log/cron.log
    ```
*   **Se você fez a Opção B (Site Personalizado):** O log fica na pasta do site, então o comando é:
    ```bash
    docker exec nginx-teste cat /usr/share/nginx/html/cron.txt
    ```

**2. Testar o container do Cron separado:**
```bash
docker run -d --name cron-teste cron-daemon:latest
```

Verifique:
```bash
docker ps
docker logs cron-teste
```

Para ver os logs da tarefa agendada (espere 1 minuto):
```bash
docker exec cron-teste cat /var/log/cron-task.log
```

**3. Parar e remover os containers de teste:**
```bash
docker stop nginx-teste cron-teste
docker rm nginx-teste cron-teste
```

### 5.8. Tirar prints

Primeiro, crie a pasta para salvar as evidências:
```bash
mkdir -p ~/projeto-a3/docs/evidencias/tarefa-2
```

Tire **3 prints** para o artigo e a apresentação:

1. `docker ps` mostrando os containers rodando.
2. `docker logs cron-teste` (ou `cat`) mostrando a tarefa executando.
3. `docker images` mostrando as imagens criadas.
*   **(Opcional)** Se você fez o **Site Personalizado (Opção B)**, tire um print também da tela do navegador mostrando o site e o log atualizando.

Salve em `docs/evidencias/tarefa-2/`.

### 5.9. Subir para o GitHub

```bash
cd ~/projeto-a3
git status
git checkout -b feature/containers
git add nginx/ cron/
git commit -m "Adiciona containers Nginx e Cron"
git push origin feature/containers
```

Depois, no GitHub:
1. Abra o repositório.
2. Clique em **Compare & pull request**.
3. Escreva uma descrição curta.
4. Clique em **Create pull request**.
5. Avise no grupo para alguém revisar.

---

## 6. Código completo (resumo dos arquivos)

### `nginx/Dockerfile` (Opção A - Básica)
```dockerfile
FROM nginx:alpine

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'busybox crond -b -l 8 -c /etc/crontabs' >> /entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

RUN echo "* * * * * date >> /var/log/cron.log" > /etc/crontabs/root

CMD ["/entrypoint.sh"]
```

### `nginx/Dockerfile` (Opção B - Site)
```dockerfile
FROM nginx:alpine

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'busybox crond -b -l 8 -c /etc/crontabs' >> /entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

RUN echo "* * * * * date >> /usr/share/nginx/html/cron.txt" > /etc/crontabs/root

COPY html /usr/share/nginx/html

CMD ["/entrypoint.sh"]
```

### `nginx/entrypoint.sh` (opcional)
```bash
#!/bin/sh
busybox crond -b -l 8 -c /etc/crontabs
nginx -g "daemon off;"
```

### `cron/Dockerfile`
```dockerfile
FROM alpine:latest

RUN echo "* * * * * date >> /var/log/cron-task.log" > /etc/crontabs/root

CMD ["busybox", "crond", "-f", "-l", "8", "-c", "/etc/crontabs"]
```

### `cron/crontab` (opcional)
```
* * * * * date >> /var/log/cron-task.log
```

---

## 7. Erros comuns e soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `setpgid: Operation not permitted` | O pacote `dcron` falha no Docker | Use o `busybox crond` (como está no Dockerfile atual) |
| Container para logo após iniciar | Cron rodando em background | Usar `crond -f` (foreground) |
| `nginx: command not found` | Imagem base errada | Usar `nginx:alpine` como base |
| `apk: command not found` | Imagem base não é Alpine | Verificar se o `FROM` é Alpine |
| `docker: command not found` | Docker Desktop fechado | Abrir o Docker Desktop e esperar |
| `permission denied` no docker | Usuário não está no grupo docker | `sudo usermod -aG docker $USER` e reiniciar |
| Porta 80 já em uso | Outro serviço usando a porta | Usar `-p 8080:80` no `docker run` |
| Cron não executa a tarefa | Formato do crontab errado | Verificar o formato `* * * * * comando` |
| `cat: can't open '/var/log/cron.log'` | Tentando ler o log básico, mas você fez o site | Use o caminho `/usr/share/nginx/html/cron.txt` |
| Site com "404 Not Found" ou baixando arquivo | O Dockerfile está gravando o log com a extensão errada ou no lugar errado | Use o Dockerfile da Opção B (que grava em `/usr/share/nginx/html/cron.txt`) |

---

## 8. Próximos passos

Depois de terminar:

1. Avise no grupo que os containers estão prontos e as imagens `nginx-cron:latest` e `cron-daemon:latest` foram buildadas.
2. A Tarefa 3 vai usar essas imagens no Kubernetes.
3. Se a Tarefa 3 pedir ajustes, atenda e refaça o build.
4. Guarde os prints para o artigo e os slides.
