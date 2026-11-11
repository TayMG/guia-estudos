/* Banco do quiz — Fila Bancária (A3 · Sergio). a = índice correto; e = explicação. */
window.QUIZ_DATA = [
  {
    q: "Qual é a política de escalonamento realmente implementada no código?",
    opts: [
      "3 super, 2 padrão e 1 convencional, em ciclo fechado",
      "2 super, 1 padrão e 2 convencionais",
      "80+ com prioridade absoluta e, quando ela está vazia, 2 padrão : 1 convencional",
      "1 padrão : 1 convencional, sem prioridade para 80+"
    ],
    a: 2,
    e: "Alexandre.py usa `if fila_super` para atender 80+ imediatamente e `_limites=(2,1)` para o ciclo entre padrão e convencional. O 3:2:1 aparece no README/PDF, mas não no código."
  },
  {
    q: "Por que a documentação 3:2:1 não corresponde ao código?",
    opts: [
      "Porque o código tem um bug e deveria ser 3:2:1",
      "Porque 80+ é absoluto, não uma cota de 3; a documentação ficou desatualizada",
      "Porque o Supabase não aceita o número 3",
      "Porque o teste usa 3:2:1 e o código usa 2:1"
    ],
    a: 1,
    e: "Se 80+ fosse uma cota de 3, o quarto 80+ teria que esperar o próximo ciclo. O código escolheu prioridade absoluta e reduziu o ciclo a 2:1. Os testes confirmam 2:1."
  },
  {
    q: "O que acontece quando chega um cliente de 80+ no meio do ciclo 2:1?",
    opts: [
      "Ele espera o ciclo terminar",
      "Ele é chamado imediatamente e o contador do ciclo é zerado",
      "Ele é chamado imediatamente e a etapa/contador permanecem iguais",
      "Ele é colocado na fila convencional"
    ],
    a: 2,
    e: "A função remove o super e devolve `etapa` e `contador` sem alteração. O teste P0, S0, P1, C0 prova que o ciclo retoma de onde parou."
  },
  {
    q: "Segundo a Resolução TSE 23.759/2026, art. 14, §3º, a prioridade dos 80+ é:",
    opts: [
      "Absoluta sobre todos, independentemente da ordem de chegada",
      "Especial apenas dentre os idosos, em relação aos demais idosos",
      "Igual à dos idosos de 60 a 79",
      "Válida apenas em hospitais"
    ],
    a: 0,
    e: "A norma do TSE dá ao 80+ preferência sobre as demais pessoas, independentemente do momento de chegada. O Estatuto, com a Lei 13.466/2017 (sancionada em 12/07/2017), fala “dentre os idosos”; o projeto adota o modelo do TSE para o nível 0."
  },
  {
    q: "Qual dispositivo garante prioridade em instituições financeiras?",
    opts: [
      "Lei 10.048/2000, art. 2º, parágrafo único",
      "Lei 12.764/2012, art. 1º",
      "Lei 13.466/2017, art. 2º",
      "Código de Defesa do Consumidor, art. 1º"
    ],
    a: 0,
    e: "O parágrafo único do art. 2º da Lei 10.048 diz que é assegurada, em todas as instituições financeiras, a prioridade de atendimento às pessoas do art. 1º."
  },
  {
    q: "O que a Lei 12.764/2012 estabelece sobre a pessoa com TEA?",
    opts: [
      "Que ela não tem direito a prioridade",
      "Que ela é considerada pessoa com deficiência para todos os efeitos legais",
      "Que ela só tem prioridade em escolas",
      "Que ela substitui a Lei 10.048"
    ],
    a: 1,
    e: "O art. 1º, §2º, equipara a pessoa com TEA à pessoa com deficiência para todos os efeitos legais. O projeto a inclui na prioridade padrão."
  },
  {
    q: "Na Lei 10.048 atualizada, o doador de sangue é atendido:",
    opts: [
      "Antes de todos os grupos",
      "Junto com os 80+",
      "Depois de todos os demais prioritários, com comprovante válido por 120 dias",
      "Não tem prioridade"
    ],
    a: 2,
    e: "A Lei 14.626/2023 incluiu o doador, mas ele é o último na ordem e precisa de comprovante. O projeto não modela esse caso."
  },
  {
    q: "Qual grupo legal NÃO está no seed do projeto?",
    opts: [
      "Gestante",
      "Pessoa com deficiência",
      "Doador de sangue",
      "Pessoa com obesidade"
    ],
    a: 2,
    e: "O seed tem 80+, idoso 60–79, gestante, lactante, criança de colo, PCD, obesidade, TEA e convencional. Não tem mobilidade reduzida nem doador de sangue."
  },
  {
    q: "O que significa FIFO dentro de cada fila?",
    opts: [
      "O mais prioritário sai primeiro, independentemente da chegada",
      "O primeiro que chegou no nível sai primeiro",
      "O último que chegou sai primeiro",
      "A ordem é sorteada"
    ],
    a: 1,
    e: "FIFO = First In, First Out. O gerenciador ordena por `data_chegada` e usa `append`/`popleft`. O teste de ordenação prova isso."
  },
  {
    q: "Qual é a complexidade de `deque.popleft()`?",
    opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    a: 0,
    e: "O deque é uma lista duplamente encadeada de blocos; remover da cabeça é O(1). Já `list.pop(0)` é O(n), porque desloca os elementos."
  },
  {
    q: "Por que não usar `list.pop(0)` para chamar o próximo?",
    opts: [
      "Porque list não aceita objetos",
      "Porque cada remoção no início desloca todos os elementos, O(n)",
      "Porque list não tem tamanho",
      "Porque o Python proíbe pop(0)"
    ],
    a: 1,
    e: "Em uma lista contígua, remover o primeiro elemento exige mover os demais. Com deque, a operação é O(1)."
  },
  {
    q: "Qual é a principal razão para usar três filas em vez de uma heap?",
    opts: [
      "A heap não funciona em Python",
      "A heap não expressa a cota 2:1; as filas deixam a política explícita",
      "A heap é sempre mais lenta",
      "A heap não aceita prioridade"
    ],
    a: 1,
    e: "Uma heap ordena por chave, mas não sabe “duas padrão para cada convencional”. Você poderia simular com contadores, mas as deques deixam o FIFO e a cota mais legíveis."
  },
  {
    q: "O que o teste `test_super_nao_altera_contador_do_ciclo_21` prova?",
    opts: [
      "Que o 80+ zera o ciclo",
      "Que o 80+ é atendido e o ciclo retoma de onde parou",
      "Que o 80+ entra na fila padrão",
      "Que o ciclo é 3:2:1"
    ],
    a: 1,
    e: "A sequência P0, S0, P1, C0 mostra que o super não altera etapa/contador. Se resetasse, a convencional seria adiada."
  },
  {
    q: "Se a fila padrão estiver vazia e houver convencionais, o algoritmo:",
    opts: [
      "Retorna None",
      "Fica em loop infinito",
      "Avança a etapa e chama a convencional sem desperdiçar chamada",
      "Chama o primeiro da fila super"
    ],
    a: 2,
    e: "O laço detecta `not fila`, avança para a etapa 1, zera o contador e tenta de novo. O teste com 1S + 5C confirma."
  },
  {
    q: "Quando as três filas estão vazias, `aplicar_starvation` retorna:",
    opts: [
      "Um cliente vazio",
      "None, None, 0, 0",
      "None, None, etapa, contador",
      "Uma exceção"
    ],
    a: 1,
    e: "A checagem inicial retorna `None, None, 0, 0`. O teste `test_todas_vazias_retorna_none` cobre o gerenciador."
  },
  {
    q: "Com 100 padrão e 1 convencional, as três primeiras chamadas são:",
    opts: ["P, P, C", "C, P, P", "P, C, P", "C, C, P"],
    a: 0,
    e: "O ciclo 2:1 chama duas padrão e depois uma convencional. É o teste `test_anti_inanicao_sob_pico_de_padrao`."
  },
  {
    q: "Com 2 super, 3 padrão e 2 convencionais, qual é a sexta chamada?",
    opts: ["S1", "P1", "C0", "P2"],
    a: 3,
    e: "A ordem é S0, S1, P0, P1, C0, P2. Depois de C0, o ciclo volta à etapa 0 e chama P2."
  },
  {
    q: "Qual é o valor de `_limites` no gerenciador?",
    opts: ["(3, 2, 1)", "(2, 1)", "(1, 2)", "(2, 2)"],
    a: 1,
    e: "`_limites = (2, 1)` significa 2 chamadas da padrão para 1 da convencional. O 80+ não usa essa tupla."
  },
  {
    q: "Qual é o problema de `estado_contadores()`?",
    opts: [
      "Ele não retorna dicionário",
      "Ele usa o literal 2 em vez de `self._limites[0]`",
      "Ele soma os contadores",
      "Ele altera a fila"
    ],
    a: 1,
    e: "Se a cota da padrão mudasse para 3, o método continuaria mostrando 2 quando a etapa não fosse 0. É um bug de manutenção."
  },
  {
    q: "O que `@dataclass(frozen=True)` garante?",
    opts: [
      "Que o objeto é imutável após a criação",
      "Que o objeto é serializado em JSON",
      "Que o objeto é thread-safe",
      "Que o objeto é salvo no banco"
    ],
    a: 0,
    e: "Frozen impede atribuição aos campos e levanta `FrozenInstanceError`. Não tem relação com thread safety ou persistência."
  },
  {
    q: "Quais são os valores de `NivelPrioridade`?",
    opts: [
      "SUPER=2, PADRAO=1, CONVENCIONAL=0",
      "SUPER=0, PADRAO=1, CONVENCIONAL=2",
      "SUPER=1, PADRAO=2, CONVENCIONAL=3",
      "SUPER=0, PADRAO=2, CONVENCIONAL=1"
    ],
    a: 1,
    e: "0 = super, 1 = padrão, 2 = convencional. Menor número = maior prioridade. Isso é contraintuitivo e exige atenção."
  },
  {
    q: "Qual é o desalinhamento entre `StatusCliente` e o enum do SQL?",
    opts: [
      "O Python tem 4 status e o SQL tem 2",
      "O Python tem 2 (`aguardando`, `atendido`) e o SQL tem 4 (inclui `em_atendimento` e `cancelado`)",
      "Os dois têm exatamente os mesmos valores",
      "O SQL não tem status"
    ],
    a: 1,
    e: "O Python só conhece aguardando/atendido; o SQL tem também em_atendimento/cancelado. Se vier um status desconhecido, o código cai em AGUARDANDO."
  },
  {
    q: "Qual é o bug do `id` no extrator?",
    opts: [
      "O extrator duplica o id",
      "O extrator remove a coluna `id`; o gerenciador acaba usando o CPF",
      "O id é sempre nulo",
      "O id é convertido em data"
    ],
    a: 1,
    e: "`drop(columns=[\"id\", \"id_motivo\"])` remove o UUID. Depois, `row.get(\"id\") or row.get(\"cpf\")` faz o CPF virar o identificador."
  },
  {
    q: "O que `pd.read_json(self.url)` faz no extrator?",
    opts: [
      "Lê um arquivo local",
      "Faz uma requisição HTTP e converte o JSON em DataFrame",
      "Abre o Supabase no navegador",
      "Cria a tabela no banco"
    ],
    a: 1,
    e: "A URL aponta para a API REST do Supabase. O pandas faz o GET e converte. Não há timeout, validação de status ou paginação."
  },
  {
    q: "Qual é a distribuição usada pelo gerador?",
    opts: [
      "50% super, 35% padrão, 15% convencional",
      "15% super, 35% padrão, 50% convencional",
      "33% para cada",
      "80% super, 10% padrão, 10% convencional"
    ],
    a: 1,
    e: "`random.choices([0,1,2], weights=[0.15,0.35,0.50])`. A convencional é maioria; a super é rara."
  },
  {
    q: "Para um cliente 80+, o Faker gera idade entre:",
    opts: ["60 e 79", "70 e 90", "80 e 105", "18 e 59"],
    a: 2,
    e: "`fake.date_of_birth(minimum_age=80, maximum_age=105)`. Para o idoso padrão, a faixa é 60–79."
  },
  {
    q: "Quem preenche `data_chegada` nos clientes gerados?",
    opts: [
      "O Faker",
      "O gerador, com `datetime.now()`",
      "O banco, com `DEFAULT now()`",
      "O Streamlit"
    ],
    a: 2,
    e: "O dicionário do gerador não inclui `data_chegada`; a coluna tem `DEFAULT now()`. Isso significa que todos os inseridos no mesmo lote podem ter horários muito próximos."
  },
  {
    q: "Quantas tabelas tem o schema?",
    opts: ["2", "3", "4", "5"],
    a: 2,
    e: "`tipo_prioridade`, `motivo_prioridade`, `clientes_fila` e `atendimentos`. As views `cliente_fila` e `atendimento` não são tabelas."
  },
  {
    q: "O que o índice `idx_proximo_fila` cobre?",
    opts: [
      "Todas as linhas, por nome",
      "Somente `status='aguardando'`, por nível e data de chegada",
      "Somente `atendidos`, por guichê",
      "A tabela de motivos"
    ],
    a: 1,
    e: "É um índice parcial: `ON clientes_fila(nivel_prioridade, data_chegada) WHERE status='aguardando'`. Ele acelera a consulta do próximo, mas o app carrega tudo."
  },
  {
    q: "O que significa RLS configurada com `USING (true)`?",
    opts: [
      "Que só usuários autenticados leem",
      "Que qualquer portador da chave pode ler e escrever",
      "Que a tabela está criptografada",
      "Que o banco está offline"
    ],
    a: 1,
    e: "RLS está ligada, mas a política não restringe nada. Na prática, a chave pública pode fazer SELECT/INSERT/UPDATE/DELETE."
  },
  {
    q: "Por que a tabela `atendimentos` não recebe registros?",
    opts: [
      "Porque o SQL não criou a tabela",
      "Porque nenhuma função chama `registrar_chamada()` de um repositório concreto",
      "Porque o Supabase não aceita INSERT",
      "Porque o guichê é sempre nulo"
    ],
    a: 1,
    e: "O gerenciador só chama `registrar_chamada()` se receber um repositório; o app não injeta. O Streamlit nem chama o gerenciador."
  },
  {
    q: "Por que o nome `streamlit.py` é problemático?",
    opts: [
      "Porque o Streamlit exige `.py`",
      "Porque pode sombrear o pacote `streamlit` no `import`",
      "Porque nomes com 10 letras são inválidos",
      "Porque o arquivo precisa ser `.html`"
    ],
    a: 1,
    e: "O diretório do script entra no `sys.path`. Se existe `streamlit.py`, o `import streamlit` pode resolver para o próprio arquivo. Renomear para `app.py` resolve."
  },
  {
    q: "O README manda rodar `streamlit run app.py`. Qual é o problema?",
    opts: [
      "O comando correto é `python app.py`",
      "O arquivo `app.py` não existe; o script é `streamlit.py`",
      "O Streamlit não aceita `run`",
      "O arquivo é `main.py`"
    ],
    a: 1,
    e: "Não há `app.py` no repositório. O arquivo é `streamlit.py`. O README está desatualizado."
  },
  {
    q: "Qual dependência o `requirements.txt` não lista, mas o código importa?",
    opts: ["pandas", "unittest", "datetime", "uuid"],
    a: 0,
    e: "`gerenciador_filas.py` e `extracao.py` importam pandas. O Streamlit instala pandas como dependência transitiva, mas isso não é garantia."
  },
  {
    q: "Para que serve `st.session_state` no painel?",
    opts: [
      "Para estilizar a página",
      "Para manter o gerenciador e os contadores entre reruns",
      "Para conectar ao Supabase",
      "Para gerar CPF"
    ],
    a: 1,
    e: "O Streamlit reexecuta o script a cada interação. Sem session_state, o gerenciador seria recriado e o ciclo 2:1 perderia o estado."
  },
  {
    q: "Qual é o estado real da interface no repositório?",
    opts: [
      "Painel completo com TV e botão",
      "Apenas um teste de conexão e duas métricas",
      "Um app React",
      "Um app mobile"
    ],
    a: 1,
    e: "`streamlit.py` conecta e mostra “Categorias Configuradas” e “Clientes Atuais na Fila”. Não há botão, fila ou session_state."
  },
  {
    q: "Quantos testes há em `testes_frente2.py`?",
    opts: ["10", "12", "15", "20"],
    a: 2,
    e: "São 15 métodos de teste. O último, de integração real, é pulado se não houver SUPABASE_URL/KEY."
  },
  {
    q: "O que os testes NÃO cobrem?",
    opts: [
      "FIFO dentro da convencional",
      "O 80+ no meio do ciclo",
      "Concorrência, UI e atualização de status",
      "Filas vazias"
    ],
    a: 2,
    e: "A suíte cobre o núcleo do algoritmo, FIFO, filas vazias e o fake do extrator. Não cobre UI, transação, concorrência ou status real."
  },
  {
    q: "Qual é o risco de LGPD mais evidente no schema?",
    opts: [
      "Guardar nome e CPF com RLS aberta e motivo de saúde em texto",
      "Usar PostgreSQL",
      "Usar UUID",
      "Ter uma tabela de prioridades"
    ],
    a: 0,
    e: "CPF é dado pessoal; o motivo pode revelar condição de saúde (dado sensível). Com RLS `true`, o risco é ampliado. Faltam base legal, minimização e controle de acesso."
  },
  {
    q: "Dois caixas chamam ao mesmo tempo. O que pode acontecer?",
    opts: [
      "Nada; o deque é distribuído",
      "Os dois podem receber o mesmo cliente, pois não há lock/transação",
      "O Supabase bloqueia automaticamente",
      "O Python cria um segundo banco"
    ],
    a: 1,
    e: "O deque é local ao processo. Sem `SELECT ... FOR UPDATE SKIP LOCKED` ou lock distribuído, duas chamadas concorrentes podem selecionar o mesmo cliente."
  },
  {
    q: "Qual melhoria ataca diretamente a inconsistência de status?",
    opts: [
      "Trocar deque por list",
      "Uma transação que marca `em_atendimento` e grava em `atendimentos`",
      "Aumentar o batch do Faker",
      "Mudar o nome do README"
    ],
    a: 1,
    e: "O problema é que a chamada não persiste a transição. Uma transação atômica resolve seleção + status + histórico; sem isso, recarregar a fila pode repetir o cliente."
  },
  {
    q: "Qual é a melhor resposta para “o ciclo é 3:2:1?”",
    opts: [
      "“Sim, conforme o PDF”",
      "“O código e os testes fazem 2:1; a documentação está desatualizada”",
      "“Depende do banco”",
      "“O ciclo é 1:1”"
    ],
    a: 1,
    e: "A resposta correta reconhece a divergência e aponta a prova: `_limites=(2,1)` e os testes. Repetir o PDF é entregar uma contradição."
  },
  {
    q: "A norma do TSE que dá prioridade absoluta ao 80+ se aplica diretamente à fila bancária?",
    opts: [
      "Sim; ela revoga a Lei 10.048/2000 nos bancos",
      "Não; ela rege a fila de votação, e o projeto a usa como referência para o nível 0",
      "Sim, mas só para clientes com mais de 90 anos",
      "Não; ela proíbe qualquer prioridade em bancos"
    ],
    a: 1,
    e: "A Resolução TSE 23.759/2026 é norma eleitoral. No banco, a base é a Lei 10.048/2000, art. 2º, parágrafo único, com o Estatuto da Pessoa Idosa. O projeto adota o modelo do TSE como referência interpretativa e de desenho do 80+ absoluto."
  }
];
