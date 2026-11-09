/* Banco do quiz. a = índice da alternativa correta. e = explicação. */
window.QUIZ_DATA = [
  {
    q: "Qual é a diferença essencial entre um container e uma máquina virtual?",
    opts: [
      "O container tem kernel próprio; a VM compartilha o kernel do host",
      "O container compartilha o kernel do host e isola processos com namespaces e cgroups; a VM tem kernel próprio",
      "A VM é mais leve porque não precisa de sistema operacional",
      "Não há diferença técnica, só de ferramenta"
    ],
    a: 1,
    e: "Container = processos isolados por namespaces e limitados por cgroups, rodando sobre o MESMO kernel. VM = kernel próprio, virtualizado por hypervisor. Por isso o container sobe em milissegundos e a VM em dezenas de segundos."
  },
  {
    q: "No Pod da API, que usa hostPID: true, o uvicorn é o PID 1 do container?",
    opts: [
      "Sim, porque o CMD do Dockerfile sempre vira PID 1",
      "Não: com hostPID o Pod compartilha o namespace de PID do nó, então o uvicorn recebe um PID do host e o PID 1 é o init do nó",
      "Sim, porque o Kubernetes renomeia o processo para PID 1",
      "Não, porque o uvicorn roda dentro do kubelet"
    ],
    a: 1,
    e: "O CMD vira PID 1 apenas quando o container tem um namespace de PID próprio. Com hostPID: true não há namespace novo: o processo entra no namespace do nó e recebe um PID do host. É por isso que o /processes lista 83 processos. Já no container do Nginx, que não usa hostPID, o PID 1 tende a ser o script de entrada."
  },
  {
    q: "O que o hostPID: true faz no Pod da API?",
    opts: [
      "Dá acesso root ao container",
      "Compartilha o namespace de PID do nó, então a API enxerga os processos do host",
      "Monta o sistema de arquivos do host dentro do container",
      "Permite que o Pod escale automaticamente"
    ],
    a: 1,
    e: "hostPID compartilha o namespace de PID. Sem ele, o psutil só veria o próprio container (uvicorn + filhos). Com ele, o /processes lista 83 processos do nó, incluindo kubelet e etcd — é a prova do print hostPID_kubernete.png."
  },
  {
    q: "Por que os YAMLs usam imagePullPolicy: Never?",
    opts: [
      "Para economizar banda, baixando só uma vez",
      "Porque as imagens foram carregadas localmente no nó com minikube image load",
      "Porque as imagens são públicas e não precisam de login",
      "Porque o cluster não tem internet"
    ],
    a: 1,
    e: "As três imagens são construídas localmente e injetadas no nó com minikube image load. Como não existem em registry nenhum, o kubelet precisa ser proibido de tentar baixar — daí Never. Se a imagem não estiver no nó, o Pod fica em ErrImageNeverPull."
  },
  {
    q: "Quem recria o Pod quando ele é deletado manualmente com kubectl delete pod?",
    opts: ["O kubelet", "O kube-proxy", "O ReplicaSet controller", "O scheduler"],
    a: 2,
    e: "O Deployment cria um ReplicaSet, e o ReplicaSet controller (dentro do kube-controller-manager) compara estado desejado (2 réplicas) com o atual (1) e cria um Pod novo. O kubelet só executa o que existe; ele não cria Pods."
  },
  {
    q: "E quando o container morre mas o Pod continua existindo (crash)?",
    opts: [
      "O ReplicaSet cria outro Pod",
      "O kubelet reinicia o container no mesmo Pod, conforme restartPolicy: Always",
      "O Pod é apagado",
      "O HPA cria uma réplica"
    ],
    a: 1,
    e: "São dois níveis de self-healing: container morto → kubelet reinicia no mesmo Pod (restartPolicy Always, padrão). Pod deletado → ReplicaSet cria outro Pod. Saber separar isso é uma das perguntas mais prováveis."
  },
  {
    q: "Para o HPA de CPU funcionar, o Deployment precisa obrigatoriamente de quê?",
    opts: [
      "Limits de memória",
      "resources.requests.cpu definido",
      "Um Service do tipo LoadBalancer",
      "pelo menos 3 réplicas"
    ],
    a: 1,
    e: "A métrica de utilização do HPA é uso médio ÷ request. Sem requests.cpu, o percentual é indefinido e o HPA mostra <unknown>. No projeto: requests 100m, limite 500m, alvo 50% (ou seja, ~50m por Pod)."
  },
  {
    q: "O que significa o print do HPA mostrar 204%/50%?",
    opts: [
      "O cluster está com 204% de CPU total",
      "Cada Pod da API está usando em média ~204% do seu request de 100m (≈204m), contra um alvo de 50%",
      "O HPA vai criar 204 réplicas",
      "Erro de leitura do metrics-server"
    ],
    a: 1,
    e: "É utilização relativa ao request: 204% de 100m ≈ 204m por Pod. Como o alvo é 50%, o HPA calcula ceil(2 × 204/50) ≈ 9 e sobe as réplicas — foi o que os prints mostram (2 → 4 → 8 → 9 → 10, limitado pelo maxReplicas)."
  },
  {
    q: "Por que o Deployment do cron tem apenas 1 réplica, e a API tem 2?",
    opts: [
      "Porque o cron não suporta escalonamento",
      "Porque duas réplicas do cron executariam a mesma tarefa agendada em duplicidade, sem leader election",
      "Porque o cron consome muita memória",
      "Porque o Kubernetes limita a 1 réplica por namespace"
    ],
    a: 1,
    e: "O crond não tem coordenação entre instâncias: cada réplica rodaria o mesmo * * * * * e geraria execução duplicada. A API é stateless, então escala à vontade. É uma decisão de arquitetura que vale citar."
  },
  {
    q: "O Service encontra os Pods por qual mecanismo?",
    opts: [
      "Pelo nome do Pod",
      "Pelo endereço IP fixo de cada Pod",
      "Por labels e selector (app: process-api)",
      "Pelo nodePort"
    ],
    a: 2,
    e: "O selector do Service filtra Pods por label. É por isso que o label do template do Deployment tem que ser idêntico ao selector do Service — se divergir, o Service fica sem endpoints e o curl dá connection refused."
  },
  {
    q: "Qual é a faixa válida de nodePort no Kubernetes?",
    opts: ["1–1024", "8000–9000", "30000–32767", "Qualquer porta acima de 1024"],
    a: 2,
    e: "Por padrão 30000–32767. O projeto usa 30080 (API) e 30081 (Nginx), ambas dentro da faixa."
  },
  {
    q: "O que é o etcd?",
    opts: [
      "O runtime de containers do nó",
      "O banco de dados chave-valor distribuído que guarda todo o estado do cluster",
      "O proxy de rede dos Services",
      "O servidor web do Kubernetes"
    ],
    a: 1,
    e: "O etcd é a fonte da verdade do cluster: todo objeto (Pod, Service, HPA) é um registro nele. Se o etcd se perde, o cluster perde o estado. Fica no control plane."
  },
  {
    q: "O que o kube-proxy faz?",
    opts: [
      "Cria os Pods",
      "Implementa as regras de rede dos Services (iptables/IPVS) para encaminhar tráfego aos Pods",
      "Faz o agendamento dos Pods nos nós",
      "Gerencia o DNS do cluster"
    ],
    a: 1,
    e: "O kube-proxy mantém as regras de rede no nó para que o IP virtual do Service seja traduzido para um Pod real. Quem decide em qual nó o Pod roda é o scheduler; quem cria o Pod é o kubelet a partir da API."
  },
  {
    q: "Por que o projeto usa NodePort e não LoadBalancer?",
    opts: [
      "Porque NodePort é mais seguro",
      "Porque LoadBalancer exige um provedor de nuvem (ou MetalLB) para provisionar IP externo; no Minikube local, NodePort resolve",
      "Porque LoadBalancer não funciona com Deployments",
      "Porque NodePort tem melhor desempenho"
    ],
    a: 1,
    e: "LoadBalancer depende de um controlador de nuvem. No Minikube, o mais simples é NodePort (30080/30081) e, no Windows, acessar via minikube service, que abre um túnel para o IP do nó."
  },
  {
    q: "O que a API faz em DELETE /processes/{pid} com force=false?",
    opts: [
      "Envia SIGKILL",
      "Envia SIGTERM, pedindo encerramento educado",
      "Remove o Pod",
      "Reinicia o processo"
    ],
    a: 1,
    e: "proc.terminate() = SIGTERM (15), que o processo pode tratar e encerrar limpando recursos. Com force=true, proc.kill() = SIGKILL (9), que não pode ser ignorado."
  },
  {
    q: "Por que a primeira chamada a GET /processes/{pid} costuma retornar cpu_percent 0.0?",
    opts: [
      "Porque o processo está dormindo",
      "Porque o psutil calcula CPU por delta entre duas amostras, e a primeira não tem referência anterior",
      "Porque falta permissão de leitura",
      "Porque o hostPID está desligado"
    ],
    a: 1,
    e: "cpu_percent() sem intervalo compara com a leitura anterior do mesmo processo; na primeira chamada não há anterior, então retorna 0.0. É limitação da biblioteca, não bug do projeto."
  },
  {
    q: "O que acontece se o professor rodar kubectl delete deployment api-deployment?",
    opts: [
      "Só os Pods somem; o Deployment volta sozinho",
      "O Deployment e seu ReplicaSet são removidos e os Pods da API somem; o Service fica sem endpoints",
      "Nada, porque o HPA recria",
      "O namespace é apagado"
    ],
    a: 1,
    e: "Não há nada recriando um Deployment removido — o self-healing atua do ReplicaSet para baixo. O Service continua existindo, mas sem endpoints, e o curl passa a falhar. Para voltar, kubectl apply -f api-deployment.yaml."
  },
  {
    q: "Por que o container nginx-cron não perde o log quando o Pod reinicia?",
    opts: [
      "Porque usa um PersistentVolume",
      "Na verdade ele perde: o cron.txt fica no sistema de arquivos efêmero do container",
      "Porque o ConfigMap guarda o arquivo",
      "Porque o log é enviado ao etcd"
    ],
    a: 1,
    e: "Não há volume algum. O cron.txt e o /var/log/cron-task.log vivem na camada gravável do container e desaparecem no restart. É uma limitação consciente, citada nos trabalhos futuros (PVC)."
  },
  {
    q: "Qual é a diferença entre o namespace do Linux e o namespace do Kubernetes?",
    opts: [
      "São a mesma coisa",
      "Namespace do Linux isola recursos do kernel (PID, rede, mount); namespace do K8s é uma divisão lógica de objetos dentro do cluster",
      "O do K8s isola processos; o do Linux organiza arquivos",
      "O do Linux só existe em containers"
    ],
    a: 1,
    e: "Nomes iguais, conceitos diferentes. O daemon-lab é um namespace de Kubernetes (escopo de nomes de objetos). O hostPID mexe no namespace de PID do Linux."
  },
  {
    q: "O que é o container 'pause' que aparece no /processes?",
    opts: [
      "Um container de backup do Kubernetes",
      "O container mínimo que mantém o namespace de rede do Pod vivo",
      "O container do kubelet",
      "Um processo do Docker Desktop"
    ],
    a: 1,
    e: "Cada Pod tem um sandbox (pause) que segura os namespaces de rede e IPC. Os containers reais do Pod entram nesses namespaces. É por isso que os Pods de um mesmo Pod compartilham IP e porta."
  },
  {
    q: "O que o FastAPI gera automaticamente em /docs?",
    opts: [
      "Um backup do banco",
      "A interface Swagger UI a partir do schema OpenAPI das rotas",
      "Um dashboard de métricas",
      "O log do servidor"
    ],
    a: 1,
    e: "O FastAPI deriva o OpenAPI do código (tipos + decorators) e serve o Swagger em /docs e o JSON em /openapi.json. É por isso que os 4 endpoints aparecem sem escrever documentação."
  },
  {
    q: "Por que o comando é executado com Popen(command.split()) e não com shell=True?",
    opts: [
      "Porque shell=True é mais lento",
      "Porque sem shell não há interpretação de ; | && — reduz o risco de injeção de comando",
      "Porque o Python não suporta shell=True",
      "Porque o Kubernetes bloqueia shell"
    ],
    a: 1,
    e: "Sem shell, o comando é dividido em argumentos e executado direto. Um `; rm -rf /` vira argumento literal, não um segundo comando. O custo é não aceitar pipes nem aspas (aí entraria shlex.split)."
  },
  {
    q: "O que acontece se o metrics-server estiver desligado?",
    opts: [
      "O cluster para",
      "O HPA fica com TARGETS <unknown> e não escala",
      "Os Pods entram em CrashLoopBackOff",
      "O Service deixa de responder"
    ],
    a: 1,
    e: "Sem métricas, o HPA não tem de onde calcular a utilização. É por isso que o roteiro roda minikube addons enable metrics-server antes de aplicar o hpa.yaml, e por que o status demora 1–2 min para sair de <unknown>."
  },
  {
    q: "Por que o hostPID: true é considerado um risco em produção?",
    opts: [
      "Porque consome mais CPU",
      "Porque o Pod enxerga e pode sinalizar processos do nó, e viola o Pod Security Standard baseline",
      "Porque impede o HPA de funcionar",
      "Porque desativa o DNS do cluster"
    ],
    a: 1,
    e: "Com hostPID, a API pode matar processos do nó — e o perfil baseline do PSS proíbe host namespaces, então o Pod nem seria admitido num cluster com a política aplicada. A mitigação é ClusterIP + port-forward, NetworkPolicy e autenticação na API (RBAC não protege uma API HTTP)."
  },
  {
    q: "Qual afirmação sobre o HPA está correta?",
    opts: [
      "O HPA aumenta a CPU do Pod",
      "O HPA muda o número de réplicas; quem muda recursos do Pod é o VPA",
      "O HPA substitui o ReplicaSet",
      "O HPA funciona sem Deployment"
    ],
    a: 1,
    e: "HPA = horizontal (mais Pods). VPA = vertical (mais CPU/memória por Pod). O HPA escreve no campo replicas do Deployment, que por sua vez ajusta o ReplicaSet."
  },
  {
    q: "Qual é a diferença entre livenessProbe e readinessProbe?",
    opts: [
      "São a mesma coisa, só mudam o nome",
      "Liveness reinicia o container quando falha; readiness tira o Pod dos endpoints do Service sem reiniciar",
      "Liveness mede CPU; readiness mede memória",
      "Readiness só funciona com StatefulSet"
    ],
    a: 1,
    e: "Liveness responde 'está vivo?' e, ao falhar, o kubelet reinicia o container. Readiness responde 'está pronto para receber tráfego?' e, ao falhar, apenas remove o Pod dos endpoints — sem reiniciar. O projeto não usa nenhuma das duas; é a primeira melhoria apontada."
  },
  {
    q: "Um Pod ultrapassa o limits.memory declarado. O que acontece?",
    opts: [
      "O Kubernetes aumenta o limite automaticamente",
      "O container é estrangulado (throttled), como na CPU",
      "O kernel mata o processo por OOM (OOMKilled), pois o cgroup de memória não pode ser 'emprestado'",
      "O Pod é movido para outro nó"
    ],
    a: 2,
    e: "Memória não é estrangulável como CPU: ao atingir memory.max, o kernel dispara o OOM killer e o container termina com OOMKilled. CPU, ao contrário, é throttled — o processo continua rodando, só recebe menos tempo. No projeto não há limite de memória, então esse risco não existe."
  },
  {
    q: "Qual é a classe QoS dos Pods da API, do Nginx e do cron, respectivamente?",
    opts: [
      "Guaranteed, Guaranteed, Burstable",
      "Burstable, BestEffort, BestEffort",
      "BestEffort, Burstable, Guaranteed",
      "Todos são Burstable, porque o namespace define a QoS"
    ],
    a: 1,
    e: "Só a API declara resources (requests 100m, limits 500m) e não tem memória, então é Burstable. Nginx e cron não declaram nada, então são BestEffort. Sob pressão de memória no nó, o kubelet despeja primeiro os BestEffort — ou seja, Nginx e cron antes da API. Guaranteed exigiria requests = limits para CPU e memória."
  },
  {
    q: "Por que o HPA não foi direto de 2 para 9 réplicas, que era o número desejado?",
    opts: [
      "Porque o metrics-server limita a subida a 4 Pods",
      "Porque a política padrão de scale-up limita a subida a 4 Pods ou 100% a cada 15 segundos",
      "Porque o Deployment não aceita mais de 8 réplicas",
      "Porque o alvo de 50% proíbe saltos maiores"
    ],
    a: 1,
    e: "A fórmula pedia 9, mas o behavior padrão do autoscaling/v2 tem scaleUp com 4 Pods/15s e 100%/15s, selectPolicy Max. Com 2 Pods, o maior acréscimo permitido é +4, então 2→4; depois 4→8; depois 8→9 (o desejado); e 9→10 quando a média caiu para 123% e o teto de 10 cortou o desejo de 23."
  },
  {
    q: "Com duas réplicas de Nginx e sem volume compartilhado, o que acontece com o cron.txt?",
    opts: [
      "Os dois Pods compartilham o mesmo arquivo automaticamente",
      "Cada Pod tem seu próprio arquivo; o conteúdo pode divergir conforme o Service escolhe a réplica",
      "O Kubernetes sincroniza o arquivo entre as réplicas",
      "O arquivo é armazenado no etcd e servido igual nos dois"
    ],
    a: 1,
    e: "O cron.txt vive no writable layer de cada container. Sem volume, cada réplica escreve o seu. O Service balanceia por conexão, então o usuário pode ver logs diferentes a cada acesso. É uma falha de consistência, não de disponibilidade."
  },
  {
    q: "Um log escrito em /usr/share/nginx/html/cron.txt sobrevive a um restart do container?",
    opts: [
      "Sim, porque pertence ao Pod",
      "Sim, porque todo Pod tem um emptyDir implícito",
      "Não, porque o writable layer é descartado; só um volume preservaria",
      "Sim, porque o kubelet copia o arquivo para o nó"
    ],
    a: 2,
    e: "Restart de container cria um container novo a partir da imagem: o writable layer anterior é descartado. Um emptyDir sobreviveria ao restart (mas não à recriação do Pod); um PVC sobreviveria aos dois. O projeto não declara volume, então o log é efêmero."
  },
  {
    q: "Pela construção do Dockerfile, quem é o PID 1 no container do Nginx?",
    opts: [
      "O processo master do Nginx",
      "O script /entrypoint.sh, que inicia o crond em background e o Nginx como filho",
      "O crond",
      "O containerd-shim"
    ],
    a: 1,
    e: "O entrypoint oficial do nginx faz exec do /entrypoint.sh, que roda 'busybox crond -b' e depois 'nginx -g \"daemon off;\"' como filho — sem exec. O PID 1 tende a ser o shell, não o Nginx. Dá para conferir com 'kubectl exec ... -- cat /proc/1/comm'. A correção seria usar 'exec nginx ...' para o Nginx receber sinais diretamente."
  },
  {
    q: "Duas réplicas do Nginx precisam enxergar o mesmo cron.txt. Qual solução resolve?",
    opts: [
      "Um emptyDir montado nas duas réplicas",
      "Um PersistentVolumeClaim com ReadWriteMany montado nas duas",
      "Um hostPath igual nas duas",
      "Um ConfigMap atualizado pelo cron"
    ],
    a: 1,
    e: "emptyDir é criado por Pod: cada réplica recebe um diretório diferente, então não compartilha. hostPath até aponta para o mesmo nó, mas quebra o isolamento e não funciona em cluster multi-nó. A resposta correta é um PVC ReadWriteMany (NFS, CephFS, EFS) — ou reduzir para uma réplica, assumindo o trade-off de disponibilidade."
  },
  {
    q: "O que DELETE /processes/{pid} devolve, e por que isso não prova que o processo morreu?",
    opts: [
      "Só devolve depois do wait(); o status é confiável",
      "Devolve 'encerrado' logo após enviar o sinal, sem wait(); o processo pode ignorar SIGTERM e continuar vivo",
      "Devolve 404 se o processo estiver vivo",
      "Devolve o código de saída do processo"
    ],
    a: 1,
    e: "A rota chama terminate() ou kill() e retorna imediatamente. Sem wait(), não há confirmação de morte: SIGTERM pode ser capturado ou ignorado. A resposta honesta é que o contrato é disparar o encerramento; para confirmar, seria preciso wait() com timeout e então SIGKILL."
  },
  {
    q: "Por que o projeto tem 3 containers mas 4 processos daemon?",
    opts: [
      "Porque o Kubernetes cria um daemon extra por Pod",
      "Porque o container do Nginx roda nginx e crond; o cron isolado roda outro crond",
      "Porque a API roda dois uvicorns",
      "Porque o pause conta como daemon"
    ],
    a: 1,
    e: "São 3 imagens e 3 containers: API (uvicorn), Nginx (nginx + crond -b) e cron (crond -f). O crond aparece duas vezes — uma dentro do Nginx, para gerar o cron.txt no mesmo filesystem da página, e outra isolada, para provar o agendador separado. O container pause não é daemon do projeto."
  },
  {
    q: "Por que não usar um CronJob do Kubernetes no lugar do cron-deployment?",
    opts: [
      "Porque CronJob não aceita schedule de 1 minuto",
      "Porque o edital quer um daemon de agendamento vivo no container; o CronJob cria um Pod novo a cada execução, sem daemon permanente",
      "Porque CronJob não funciona no Minikube",
      "Porque CronJob não consegue escrever em arquivo"
    ],
    a: 1,
    e: "O CronJob é a solução de produção para a tarefa, mas ele cria um Job/Pod por execução e termina. O projeto quer demonstrar um daemon (crond) rodando dentro do container, com processo observável. Se migrasse, usaria concurrencyPolicy: Forbid, backoffLimit e history limits, e leria o log com kubectl logs job/..."
  },
  {
    q: "Se você montar um emptyDir em /usr/share/nginx/html do container Nginx, o que quebra?",
    opts: [
      "Nada; o emptyDir copia o conteúdo da imagem",
      "O index.html da imagem é encoberto pelo volume vazio, e a página passa a dar 404",
      "O nginx deixa de escutar a porta 80",
      "O cron para de escrever por falta de permissão"
    ],
    a: 1,
    e: "Um volume montado sobre um diretório sobrepõe o conteúdo da imagem. O emptyDir começa vazio, então o index.html desaparece. A correção é usar um initContainer para copiar o HTML para o volume ou montar em um subdiretório e ajustar o root do Nginx. É o tipo de detalhe que só aparece quando você testa."
  },
  {
    q: "Qual é a mitigação correta para o risco de hostPID na API?",
    opts: [
      "Aplicar uma Role de RBAC que negue delete em pods",
      "Trocar NodePort por ClusterIP + port-forward, exigir autenticação, allowlist de PIDs e isolar o Pod em namespace privilegiado documentado",
      "Aumentar o limits de CPU do Pod",
      "Ativar o HPA com maxReplicas maior"
    ],
    a: 1,
    e: "RBAC controla o kube-apiserver, não o kill(2) que a API faz no kernel. O risco vem de UID 0 + CAP_KILL + namespace de PID do host. As mitigações são reduzir exposição (ClusterIP/port-forward), autenticar, restringir PIDs e comandos, e assumir o PSS privileged de forma isolada e auditada."
  }
];
