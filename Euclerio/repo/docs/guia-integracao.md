# Guia de Integração e Testes Finais

Este documento descreve o passo a passo para instalar as ferramentas, subir todo o projeto do zero em uma máquina nova e gerar as evidências finais de Self-healing e Scaling.

---

## PARTE 0: Instalar o Ambiente
Se o já tiver o Docker, Minikube e kubectl instalados, pule para a Parte 1.

### 0.1. Instalar o WSL2 e Ubuntu
1. No Windows, abra o **PowerShell como Administrador**.
2. Rode o comando e reinicie o PC se for pedido:
   ```powershell
   wsl --install
   ```
3. Abra o **Ubuntu** pelo menu Iniciar, crie um **usuário** e uma **senha** (não aparece na tela enquanto digita).

### 0.2. Instalar o Docker Desktop
1. Baixe e instale o **Docker Desktop** pelo site oficial (docker.com).
2. Abra o Docker Desktop, vá em **Settings** > **Resources** > **WSL Integration**.
3. Ative a chavinha do **Ubuntu** e clique em **Apply & Restart**.
4. **Importante:** O ícone da baleia no Windows precisa estar **verde** para os próximos passos funcionarem.

### 0.3. Instalar o Git (Dentro do Ubuntu)
No terminal do Ubuntu, rode:
```bash
sudo apt update
sudo apt install git -y
```

### 0.4. Instalar o Minikube (Dentro do Ubuntu)
Copie e cole os comandos abaixo, um por vez:
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64
```
*(Digite a senha do Linux se for pedido).*

### 0.5. Instalar o kubectl (Dentro do Ubuntu)
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl
```

---

## PARTE 1: Baixar o projeto e Construir as Imagens

Abra o terminal do Ubuntu e baixe o projeto direto da branch principal:
```bash
git clone https://github.com/TayMG/A3-Euclerio.git
cd A3-Euclerio
```

Agora, construa as 3 imagens Docker:
```bash
cd api
docker build -t process-api:latest .

cd ../nginx
docker build -t nginx-cron:latest .

cd ../cron
docker build -t cron-daemon:latest .
```

---

## PARTE 2: Preparar o Minikube e Carregar as Imagens

Certifique-se de que o Docker Desktop está aberto e verde. Depois, inicie o cluster e entregue as imagens para ele:
```bash
minikube start --driver=docker

minikube image load process-api:latest
minikube image load nginx-cron:latest
minikube image load cron-daemon:latest
```

---

## PARTE 3: Deploy no Kubernetes

Entre na pasta do Kubernetes e aplique os arquivos:
```bash
cd k8s

kubectl apply -f namespace.yaml
kubectl apply -f api-deployment.yaml
kubectl apply -f api-service.yaml
kubectl apply -f nginx-deployment.yaml
kubectl apply -f nginx-service.yaml
kubectl apply -f cron-deployment.yaml
```

Verifique se os 5 Pods estão `Running` (espere cerca de 30 segundos se estiverem `ContainerCreating`):
```bash
kubectl get pods -n daemon-lab
```
👉 **PRINT 1:** Tire um print desta tela mostrando todos os 5 pods com status `Running`.

Ative o HPA e aplique a configuração:
```bash
minikube addons enable metrics-server
kubectl apply -f hpa.yaml
```

---

## PARTE 4: Teste de Acesso à API

Abra o serviço da API no navegador:
```bash
minikube service api-service -n daemon-lab
```
👉 **PRINT 2:** Quando o navegador abrir, adicione `/docs` no final da URL (ou acesse a lista de processos). Tire um print mostrando a tela do Swagger (Process Manager API) rodando **de dentro do Kubernetes**.

*(⚠️ Deixe este terminal aberto, ele está mantendo o túnel para o navegador! Se fechar, o site sai do ar).*

---

## PARTE 5: Teste de Self-Healing (Auto-recuperação)

Abra uma **nova aba** no terminal do Ubuntu (`Ctrl + Shift + T`).

1. Veja os pods rodando e copie o nome de um deles que começa com `api-deployment-`:
```bash
kubectl get pods -n daemon-lab
```
2. Delete o pod:
```bash
kubectl delete pod <cole-o-nome-do-pod-aqui> -n daemon-lab
```
3. Fique assistindo a recriação:
```bash
kubectl get pods -n daemon-lab -w
```
👉 **VÍDEO 1 / PRINT 3:** Grave a tela do terminal mostrando o pod sumindo e um novo (`ContainerCreating` -> `Running`) nascendo em tempo real. Tire um print logo após o novo pod ficar `Running`. Aperte `Ctrl + C` para parar de assistir.

---

## PARTE 6: Teste de Scaling (HPA)

Abra mais uma **nova aba** no terminal (`Ctrl + Shift + T`). 

**Atenção:** Pegue a URL do túnel que foi gerada na Parte 4 (ex: `http://127.0.0.1:12345`). Substitua na linha abaixo:

1. Gere carga na API (vai travar esta aba, é normal):
```bash
while true; do curl -s http://127.0.0.1:<SUA_PORTA_AQUI>/processes > /dev/null; done
```

2. Em outra aba, assista o HPA reagir:
```bash
kubectl get hpa -n daemon-lab -w
```
👉 **VÍDEO 2 / PRINT 4:** Grave a tela mostrando a CPU subindo (ex: `80%/50%`) e as REPLICAS aumentando (ex: `2` -> `4` -> `6`). Aperte `Ctrl + C` para parar de assistir.

3. Para provar que os pods estão realmente subindo, em outra aba:
```bash
kubectl get pods -n daemon-lab -w
```
👉 **PRINT 5:** Tire um print mostrando a lista com muitos pods da API rodando juntos. Aperte `Ctrl + C` para parar de assistir.

---

## PARTE 7: Limpeza (Após a apresentação)

Após parar as gravações, aperte `Ctrl + C` na aba que está gerando o estresse (`while true`). 

Aguarde de 2 a 3 minutos e rode:
```bash
kubectl get hpa -n daemon-lab
```
👉 **PRINT 6:** Tire um print mostrando que as réplicas voltaram para `2`, provando que o HPA também sabe reduzir recursos (Scale Down).
