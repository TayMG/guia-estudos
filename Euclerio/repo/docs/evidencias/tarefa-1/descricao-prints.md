# Evidências da Tarefa 1 — API FastAPI + psutil

---

## 1. Testes Locais (Sem Docker)

| Arquivo | O que comprova |
| :--- | :--- |
| `APIrodandoTerminal.png` | Mostra o servidor Uvicorn rodando localmente com sucesso (`Application startup complete`), comprovando que o código Python não tem erros de sintaxe. |
| `testesCurl.png` | Mostra o terminal executando os comandos `curl` para os endpoints `GET /processes` e `GET /processes/1`. Comprova que a API lê o sistema operacional via `psutil` e retorna os dados em JSON corretamente. |

---

## 2. Documentação e Containerização

| Arquivo | O que comprova |
| :--- | :--- |
| `paginaNavegador.png` | Mostra a interface gráfica do Swagger gerada automaticamente pelo FastAPI (`/docs`). Comprova que os 4 endpoints exigidos pelo edital estão mapeados e visíveis. |
| `testeCurlNavegador.png` | Mostra a execução do endpoint `GET /processes` diretamente pelo navegador (botão "Try it out"). Comprova a resposta de sucesso **HTTP 200 OK** com o corpo da resposta em JSON. |
| `imagemDocker.png` | Mostra o comando `docker ps`. Comprova que a API foi empacotada com sucesso na imagem `process-api:latest` e está rodando como um container (`api-teste`) expondo a porta 8000. |
