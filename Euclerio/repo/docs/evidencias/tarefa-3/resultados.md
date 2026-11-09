# Resultados Obtidos (Tarefa 3)

| Métrica | Antes (Repouso) | Durante/Pós Teste |
| :--- | :--- | :--- |
| Réplicas da API (HPA) | 2 | 10 (sob carga de 204%) |
| Tempo de recriação do Pod (Self-healing) | — | 9 segundos |
| Uso de CPU no teste de estresse | 2% | 204% |
| Redução de réplicas (Scale Down) | 10 | 2 (após ~5 min sem carga) |
