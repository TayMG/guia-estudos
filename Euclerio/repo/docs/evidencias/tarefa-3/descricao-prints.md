# Evidências da Tarefa 3 — Kubernetes

---

## 1. Infraestrutura e Deploy Base

| Arquivo | O que comprova |
| :--- | :--- |
| `5pods.png` | Mostra os 5 Pods iniciais rodando (`Running`): 2 da API, 2 do Nginx e 1 do Cron, comprovando que o deploy base no namespace `daemon-lab` foi bem-sucedido. |
| `ProcessManagerAPI.png` / `ProcessManagerAPI-terminal.png` | Mostra a interface do Swagger (`/docs`) da API sendo acessada via navegador/túnel, comprovando que o Service (NodePort) do Kubernetes está expondo a aplicação corretamente. |
| `nginx-k8s.png` | Mostra o site do Nginx rodando com o log do cron atualizando. **Diferença crucial:** Diferente do print da Tarefa 2 (que rodava via Docker local), este comprova o Nginx rodando como um Pod dentro do Kubernetes. |
| `nginx-k8s-terminal.png` | Mostra o comando `minikube service nginx-service` criando o túnel e expondo a porta 30081. Comprova a orquestração do segundo daemon (Nginx) via NodePort no cluster. |

---

## 2. Comprovação Técnica (hostPID)

| Arquivo | O que comprova |
| :--- | :--- |
| `hostPID_kubernete.png` | **Prova principal do `hostPID`:** Mostra o `curl` acessando a API de dentro do Kubernetes e listando processos vitais do sistema operacional (como `systemd`, `kubelet`, `etcd`). Isso só é possível porque o Deployment da API foi configurado com `hostPID: true`. |

---

## 3. Self-healing (Auto-recuperação)

| Arquivo | O que comprova |
| :--- | :--- |
| `RecriacaoPod.png` | Mostra o momento em que um Pod da API foi deletado manualmente e o Kubernetes criou um novo Pod automaticamente (`ContainerCreating` -> `Running`) em menos de 10 segundos. |

---

## 4. Scaling (HPA)

| Arquivo | O que comprova |
| :--- | :--- |
| `hpa.png` | Mostra o HPA configurado, com alvo de 50% de CPU, mínimo de 2 e máximo de 10 réplicas. |
| `replicas.png` | Demonstra o **Scale Up**: Sob carga de estresse, o uso de CPU subiu e o HPA aumentou o número de réplicas da API automaticamente. |
| `replicasVoltando2.png` | Demonstra o **Scale Down**: Após o fim da carga (CPU em 2%), o HPA reduziu o número de réplicas de volta ao mínimo configurado (2), comprovando a economia de recursos. |
