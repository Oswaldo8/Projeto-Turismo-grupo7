# Projeto-Turismo-grupo7
aplicativo-viagens 

## 👥 Histórias de Usuário (User Stories)

Esta seção descreve as funcionalidades do sistema sob a perspectiva dos utilizadores, garantindo a segurança, integridade dos dados e regras de privilégios. O documento está estruturado seguindo a ordem lógica de utilização da aplicação.

---

### 1. 🔐 Acesso, Segurança e Identificação (Primeiros Passos)

#### 1.1. Registro Único de Utilizadores
* **Como** Utilizador novo,
* **Quero** registar-me na aplicação introduzindo um nome e endereço de e-mail corretamente,
* **Para** aceder às funcionalidades da plataforma de forma segura, evitando a duplicidade de contas e mantendo a integridade do sistema.
* **Critérios de Aceitação:**
  * **Dado que** estou na página de registo;
  * **Quando** introduzo um nome de utilizador que já existe no sistema;
  * **Então** o sistema deve exibir uma mensagem de erro informando que o utilizador já existe.
  * **Dado que** introduzo dados válidos e únicos;
  * **Quando** confirmo o registo;
  * **Então** a senha e o email devem ser encriptados de forma segura e a conta é criada com sucesso.

#### 1.2. Barra de Navegação Personalizada (Navbar)
* **Como** Utilizador autenticado,
* **Quero** visualizar uma barra de navegação com o nome da aplicação, uma saudação personalizada com o meu nome e a opção de sair,
* **Para** navegar pela plataforma com facilidade, identificar a minha conta ativa e encerrar a sessão de forma segura quando desejar.
* **Critérios de Aceitação:**
  * **Dado que** fiz login com sucesso na aplicação;
  * **Quando** visualizo o topo de qualquer página do sistema;
  * **Então** a barra de navegação deve exibir o nome da aplicação, a mensagem *"Olá, [Nome do Utilizador]"* e um botão/item de *"Sair"* (Logout).
  * **Dado que** clico no botão de *"Sair"*;
  * **Quando** a ação é confirmada;
  * **Então** o sistema deve destruir a sessão atual de forma segura, redirecionar-me para a página inicial/login e deixar de exibir o meu nome na barra.

---

### 2. 🗺️ Exploração e Descoberta de Locais

#### 2.1. Pesquisa Direta por Nome na Barra de Filtro
* **Como** Utilizador / Visitante,
* **Quero** procurar um local específico escrevendo o seu nome na barra de filtro/pesquisa,
* **Para** obter como retorno apenas o ponto turístico exato que nomeei, sem ter de navegar por toda a lista.
* **Critérios de Aceitação:**
  * **Dado que** estou na barra de pesquisa da aplicação;
  * **Quando** introduzo o nome exato de um ponto turístico registado (ex: *"Parque"*);
  * **Então** o sistema filtra a lista em tempo real e retorna no ecrã apenas esse resultado específico.
  * **Quando** introduzo um termo que não corresponde a nenhum local na base de dados;
  * **Então** o sistema deve ocultar todos os registos e exibir a mensagem: *"Nenhum ponto turístico encontrado com esse filtro."*.

#### 2.2. Escolha por Categorias
* **Como** Utilizador / Visitante,
* **Quero** escolher os pontos turísticos segundo a sua categoria (Parque, Museu, Monumento, Praia, Trilha),
* **Para** encontrar rapidamente os locais que correspondem aos meus interesses do momento.
* **Critérios de Aceitação:**
  * **Dado que** estou na secção de exploração da aplicação;
  * **Quando** seleciono uma categoria específica;
  * **Então** o sistema filtra e exibe apenas os pontos turísticos associados à categoria escolhida.

---

### 3. ✍️ Gestão de Pontos Turísticos e Interação

#### 3.1. Validação de Locais Duplicados
* **Como** Utilizador,
* **Quero** que o sistema me avise através de uma mensagem se eu tentar registar um local que já existe,
* **Para** evitar dados repetidos e garantir a qualidade das informações na aplicação.
* **Critérios de Aceitação:**
  * **Dado que** estou a tentar registar um novo ponto turístico;
  * **Quando** o nome e a localização coincidem com um registo já existente na base de dados;
  * **Então** o sistema bloqueia a ação e exibe o aviso: *"Este ponto turístico já se encontra registado nessa cidade"*.

#### 3.2. Criar um Ponto Turístico
* **Como** Utilizador autenticado,
* **Quero** criar um novo ponto turístico preenchendo as suas informações e categoria,
* **Para** partilhar novas descobertas com a comunidade de viajantes.
* **Critérios de Aceitação:**
  * **Dado que** fiz login corretamente na aplicação;
  * **Quando** envio o formulário com os dados do novo local;
  * **Então** o ponto turístico é guardado e associado ao meu perfil como criador.

#### 3.3. Privilégio Exclusivo de Eliminação
* **Como** Utilizador que registou um ponto turístico,
* **Quero** ter o privilégio de eliminar exclusivamente os locais que eu próprio registei,
* **Para** que outros utilizadores não possam apagar as minhas contribuições e o meu histórico seja protegido.
* **Critérios de Aceitação:**
  * **Dado que** estou a visualizar um ponto turístico criado por outro utilizador;
  * **Quando** acesso às opções do local;
  * **Então** a opção de "Eliminar" não deve estar disponível ou visível para mim.
  * **Dado que** sou o criador do ponto turístico;
  * **Quando** decido eliminar o local e confirmo a ação;
  * **Então** o registo é removido definitivamente do sistema.

#### 3.4. Avaliações e Estatísticas de Pontos Turísticos
* **Como** Utilizador registado,
* **Quero** submeter novas avaliações nos pontos turísticos e aceder a informações consolidadas sobre o feedback de todos os locais,
* **Para** partilhar as experiências e consultar quais são os destinos mais recomendados pela comunidade.
* **Critérios de Aceitação:**
  * **Dado que** estou autenticado na aplicação e visualizo o detalhe de um ponto turístico;
  * **Quando** submeto uma nova avaliação (com pontuação de 1 a 5 estrelas e um comentário opcional);
  * **Então** o sistema deve registar a minha opinião e atualizar instantaneamente a média de pontuação do local.
  * **Quando** preencho o formulário;
  * **Então** o sistema deve permitir-me introduzir uma breve descrição e uma resenha detalhada sobre a minha experiência no lugar visitado.
