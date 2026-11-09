# Descrição Evidências da Tarefa 2 — Containers Nginx e Cron

---

## 1. Configuração e Testes do Nginx

| Arquivo | O que comprova |
| :--- | :--- |
| `imagens-criadas.png` | Mostra o comando `docker images`, comprovando que as imagens `nginx-cron` e `cron-daemon` foram construídas com sucesso. |
| `verificandoDockerNginx.png` | Mostra o `docker ps`, comprovando que o container do Nginx está em execução e expondo a porta 8080. |
| `teste-conteinerNginx.png` | Mostra o terminal executando o `cat` no arquivo de log, comprovando que o cron embutido no Nginx está escrevendo as tarefas no arquivo. |
| `sitedemostracao.png` | **Prova visual de integração:** Interface web acessível via navegador, exibindo o site personalizado do projeto com o log do cron atualizando em tempo real. |

---

## 2. Testes do Cron Separado

| Arquivo | O que comprova |
| :--- | :--- |
| `TarefaAgendadaCron.png` | Mostra o log do container de Cron separado (`cron-task.log`), comprovando que o segundo daemon agendador está rodando isoladamente e executando as tarefas a cada minuto. |
