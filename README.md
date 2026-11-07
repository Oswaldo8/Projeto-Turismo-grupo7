# Projeto-Turismo-grupo7
aplicativo-viagens 

## 👥 Histórias de Usuário (User Stories)

Esta seção descreve as funcionalidades do sistema sob a perspectiva dos utilizadores, garantindo a segurança, integridade dos dados e regras de privilégios. O documento está estruturado seguindo a ordem lógica de utilização da aplicação.

---

1. 🔐 Acesso, Segurança e Identificação (Primeiros Passos)

1.1. Registro Único de Utilizadores
Como Utilizador novo,
Quero registar-me na aplicação introduzindo um nome e endereço de e-mail corretamente,
Para aceder às funcionalidades da plataforma de forma segura, evitando a duplicidade de contas e mantendo a integridade do sistema.
Critérios de Aceitação:
Dado que estou na página de registo;
Quando introduzo um nome de utilizador que já existe no sistema;
Então o sistema deve exibir uma mensagem de erro informando que o utilizador já existe.
Dado que introduzo dados válidos e únicos;
Quando confirmo o registo;
Então a senha e o email devem ser encriptados de forma segura e a conta é criada com sucesso.

1.2. Barra de Navegação Personalizada (Navbar)
Como Utilizador autenticado,
Quero visualizar uma barra de navegação com o nome da aplicação, uma saudação personalizada com o meu nome e a opção de sair,
Para navegar pela plataforma com facilidade, identificar a minha conta ativa e encerrar a sessão de forma segura quando desejar.
Critérios de Aceitação:
Dado que fiz login com sucesso na aplicação;
Quando visualizo o topo de qualquer página do sistema;
Então a barra de navegação deve exibir o nome da aplicação, a mensagem "Olá, [Nome do Utilizador]" e um botão/item de "Sair" (Logout).
Dado que clico no botão de "Sair";
Quando a ação é confirmada;
Então o sistema deve destruir a sessão atual de forma segura, redirecionar-me para a página inicial/login e deixar de exibir o meu nome na barra.

2. 🗺️ Exploração e Descoberta de Locais
2.1. Pesquisa Direta por Nome na Barra de Filtro
Como Utilizador / Visitante,
Quero procurar um local específico escrevendo o seu nome na barra de filtro/pesquisa,
Para obter como retorno apenas o ponto turístico exato que nomeei, sem ter de navegar por toda a lista.
Critérios de Aceitação:
Dado que estou na barra de pesquisa da aplicação;
Quando introduzo o nome exato de um ponto turístico registado (ex: "Parque");
Então o sistema filtra a lista em tempo real e retorna no ecrã apenas esse resultado específico.
Quando introduzo um termo que não corresponde a nenhum local na base de dados;
Então o sistema deve ocultar todos os registos e exibir a mensagem: "Nenhum ponto turístico encontrado com esse filtro.".

2.2. Escolha por Categorias
Como Utilizador / Visitante,
Quero escolher os pontos turísticos segundo a sua categoria (Parque, Museu, Monumento, Praia, Trilha),
Para encontrar rapidamente os locais que correspondem aos meus interesses do momento.
Critérios de Aceitação:
Dado que estou na secção de exploração da aplicação;
Quando seleciono uma categoria específica;
Então o sistema filtra e exibe apenas os pontos turísticos associados à categoria escolhida.

3. ✍️ Gestão de Pontos Turísticos e Interação
3.1. Validação de Locais Duplicados
Como Utilizador,
Quero que o sistema me avise através de uma mensagem se eu tentar registar um local que já existe,
Para evitar dados repetidos e garantir a qualidade das informações na aplicação.
Critérios de Aceitação:
Dado que estou a tentar registar um novo ponto turístico;
Quando o nome e a localização coincidem com um registo já existente na base de dados;
Então o sistema bloqueia a ação e exibe o aviso: "Este ponto turístico já se encontra registado nessa cidade".

3.2. Criar um Ponto Turístico
Como Utilizador autenticado,
Quero criar um novo ponto turístico preenchendo as suas informações e categoria,
Para partilhar novas descobertas com a comunidade de viajantes.
Critérios de Aceitação:
Dado que fiz login corretamente na aplicação;
Quando envio o formulário com os dados do novo local;
Então o ponto turístico é guardado e associado ao meu perfil como criador.

3.3. Privilégio Exclusivo de Eliminação
Como Utilizador que registou um ponto turístico,
Quero ter o privilégio de eliminar exclusivamente os locais que eu próprio registei,
Para que outros utilizadores não possam apagar as minhas contribuições e o meu histórico seja protegido.
Critérios de Aceitação:
Dado que estou a visualizar um ponto turístico criado por outro utilizador;
Quando acesso às opções do local;
Então a opção de "Eliminar" não deve estar disponível ou visível para mim.
Dado que sou o criador do ponto turístico;
Quando decido eliminar o local e confirmo a ação;
Então o registo é removido definitivamente do sistema.

3.4. Avaliações e Estatísticas de Pontos Turísticos
Como Utilizador registado,
Quero submeter novas avaliações nos pontos turísticos e aceder a informações consolidadas sobre o feedback de todos os locais,
Para partilhar as experiências e consultar quais são os destinos mais recomendados pela comunidade.
Critérios de Aceitação:
Dado que estou autenticado na aplicação e visualizo o detalhe de um ponto turístico;
Quando submeto uma nova avaliação (com pontuação de 1 a 5 estrelas e um comentário opcional);
Então o sistema deve registar a minha opinião e atualizar instantaneamente a média de pontuação do local.
Quando preencho o formulário;
Então o sistema deve permitir-me introduzir uma breve descrição e uma resenha detalhada sobre a minha experiência no lugar visitado.


* Funcionamento da nossa aplicação *

* Frontend * 

npm start
Executa o aplicativo no modo de desenvolvimento.
Abra http://localhost:3000 para visualizá-lo no seu navegador.
# 📍 Guia Turístico Interativo

O **Guia Turístico Interativo** é uma aplicação web desenvolvida em React que permite aos usuários explorar, cadastrar, editar e avaliar pontos turísticos em um mapa interativo. A aplicação conta com sistema de autenticação, filtragem dinâmica de locais, paginação e upload de imagens.

---

## 🚀 Tecnologias Utilizadas

*   **React** (Hooks: `useState`, `useEffect`)
*   **Axios** (Consumo de APIs REST)
*   **Leaflet & React-Leaflet** (Renderização do mapa interativo e marcadores)
*   **CSS3** (Estilização da interface integrada via `App.css`)

---

## 🔧 Pré-requisitos & Instalação

Para executar o front-end deste projeto, você precisará ter o **Node.js** e o gerenciador de pacotes **npm** (ou **yarn**) instalados em sua máquina.

1. Clone o repositório para a sua máquina local:
   ```bash
   git clone https://github.com
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd seu-repositorio
   ```
3. Instale as dependências necessárias:
   ```bash
   npm install
   ```
4. Certifique-se de que a API Back-end está rodando no endereço configurado (`http://localhost:5000`).
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

---

## 📖 Documentação das Funções

O arquivo principal controla todo o estado global da aplicação e o fluxo de telas. Abaixo estão detalhadas todas as funções envolvidas na execução:

### 🔄 Ciclo de Vida e Inicialização

*   **`useEffect` (Gatilho Inicial)**
    *   **Descrição:** Executa automaticamente assim que o componente é montado na tela.
    *   **Ação:** Invoca a função `carregarLocais()` para buscar os dados iniciais do servidor.

### 🌐 Integração com a API (Requisições HTTP)

*   **`carregarLocais()`**
    *   **Tipo:** Assíncrona (`async/await`)
    *   **Descrição:** Realiza uma requisição do tipo `GET` para o endpoint `/places`.
    *   **Fluxo:** Atualiza o estado `locais` com a lista de pontos turísticos recebida da API ou exibe um erro no console em caso de falha.

*   **`carregarDetalhesLocal(id)`**
    *   **Tipo:** Assíncrona (`async/await`)
    *   **Parâmetros:** `id` (String/Number) — O identificador exclusivo do ponto turístico.
    *   **Descrição:** Executa uma requisição `GET` para `/places/{id}` buscando dados aprofundados e avaliações de um local específico.
    *   **Fluxo:** Atualiza o estado `detalhesLocal`, altera a visualização ativa (`view`) para `'detalhes'` e move o scroll da tela do usuário para o topo (`window.scrollTo(0,0)`).

### 📝 Formulários e Envios de Dados

*   **`handleReviewSubmit(e)`**
    *   **Tipo:** Assíncrona (`async/await`)
    *   **Parâmetros:** `e` (Event) — Evento de submissão do formulário (`onSubmit`).
    *   **Descrição:** Envia uma nova avaliação (comentário e nota) vinculada ao usuário logado para o local atual por meio de uma requisição `POST`.
    *   **Fluxo:** Bloqueia o envio se o usuário não estiver logado. Limpa o formulário após o sucesso e recarrega os detalhes do ponto turístico atualizado.

*   **`handleAuthSubmit(e)`**
    *   **Tipo:** Assíncrona (`async/await`)
    *   **Parâmetros:** `e` (Event) — Evento do formulário.
    *   **Descrição:** Gerencia o processo de autenticação. Alterna dinamicamente entre os endpoints `/auth/register` (Cadastro) ou `/auth/login` (Login) dependendo do estado booleano de `isRegistering`.
    *   **Fluxo:** Guarda os dados retornados no estado `usuario`, limpa o formulário de login e redireciona a interface de volta para a tela de `'mapa'`.

*   **`handleSubmit(e)`**
    *   **Tipo:** Assíncrona (`async/await`)
    *   **Parâmetros:** `e` (Event) — Evento do formulário.
    *   **Descrição:** Processa a criação ou a atualização de um ponto turístico. Utiliza o objeto nativo `FormData` para empacotar tanto os dados de texto do formulário quanto arquivos múltiplos de imagem (`imagemFile`).
    *   **Fluxo:** Se houver um `editId` ativo, envia uma requisição `PUT` para atualizar o local; caso contrário, envia uma requisição `POST` para criar um novo registro. Ao final, reseta o formulário e executa `carregarLocais()`.

### 🛠️ Gerenciamento de Registros (CRUD)

*   **`handleEdit(local)`**
    *   **Parâmetros:** `local` (Object) — O objeto completo do ponto turístico selecionado.
    *   **Descrição:** Coloca o formulário em modo de edição.
    *   **Fluxo:** Define o `editId` com o ID do item selecionado, preenche os estados de `formData` com as informações atuais do local e realiza uma rolagem suave (`smooth scroll`) até o formulário localizado na parte inferior.

*   **`handleCancelEdit()`**
    *   **Descrição:** Cancela o modo de edição em andamento.
    *   **Fluxo:** Redefine o estado `editId` para `null` e limpa todos os campos textuais do formulário (`formData`).

*   **`handleDelete(id)`**
    *   **Tipo:** Assíncrona (`async/await`)
    *   **Parâmetros:** `id` (String/Number) — ID do local a ser excluído.
    *   **Descrição:** Dispara um alerta de confirmação nativo do navegador. Caso o usuário confirme, envia uma requisição `DELETE` para `/places/{id}` passando o ID do usuário no escopo do body para validação.
    *   **Fluxo:** Atualiza a lista da interface chamando `carregarLocais()` imediatamente após a remoção.

*   **`handleLogout()`**
    *   **Descrição:** Desconecta o usuário ativo no sistema.
    *   **Fluxo:** Redefine o estado `usuario` para `null`, altera a tela ativa para o modo de `'mapa'` e avisa o usuário através de um alerta.

---

## 🔍 Regras de Negócio Implementadas no Cliente

*   **Filtragem em Tempo Real:** A variável calculada `locaisFiltrados` filtra de forma reativa a lista de locais conforme o usuário digita no campo `filtro`. A busca avalia as propriedades de `nome`, `cidade` e `categoria` sem diferenciar letras maiúsculas ou minúsculas (`toLowerCase()`).
*   **Paginação de Dados:** O sistema restringe a exibição a um máximo de 5 pontos turísticos por página (`itensPorPagina`). O fatiamento da lista é feito dinamicamente usando os índices calculados (`indicePrimeiroItem` e `indiceUltimoItem`) através do método `.slice()`.
*   **Correção de Ativos do Leaflet:** Devido a inconsistências no mapeamento de caminhos relativos do Webpack com o React, o script altera a configuração global do Leaflet (`L.Icon.Default`) para garantir que os marcadores visuais do mapa (pins) sejam exibidos perfeitamente em tela utilizando a diretiva `require()`.


* Backend *

npm start
Executa o aplicativo no modo de desenvolvimento.
servidor rodando na porta 5000 conetado ao banco de dados SQlite.
# 📍 Guia Turístico Interativo




# ⚙️ Guia Turístico Interativo - API Back-end

Esta é a API RESTful que gerencia o ecossistema do **Guia Turístico Interativo**. Desenvolvida em Node.js com SQLite, ela lida com persistência de dados de usuários, pontos turísticos, comentários/avaliações e upload de múltiplas imagens utilizando armazenamento local.

---

## 🚀 Tecnologias Utilizadas

*   **Node.js** com **Express** (Gerenciamento de rotas e requisições HTTP)
*   **SQLite3** (Banco de dados relacional em arquivo local)
*   **Multer** (Middleware para upload de arquivos de imagem em formato `multipart/form-data`)
*   **CORS** (Liberação de acessos cruzados para o ecossistema front-end)

---

## 🔧 Pré-requisitos & Instalação

1. Certifique-se de ter o **Node.js** instalado na sua máquina.
2. Acesse a pasta onde o código do servidor está localizado:
   ```bash
   cd seu-repositorio-backend
   ```
3. Instale as dependências declaradas no projeto:
   ```bash
   npm install express sqlite3 cors multer
   ```
4. Crie uma pasta chamada `uploads` no diretório raiz do back-end para que o Multer possa guardar as fotos:
   ```bash
   mkdir uploads
   ```
5. Inicie o servidor:
   ```bash
   node app.js
   ```
   *O banco de dados `turismo.db` será criado automaticamente no primeiro início e o servidor escutará na porta `5000`.*

---

## 🗄️ Esquema do Banco de Dados (SQLite)

O arquivo de banco de dados cria e conecta de forma automática quatro tabelas interligadas via chaves estrangeiras (`FOREIGN KEY`):

*   **`usuarios`**: Guarda informações de cadastro e autenticação (`id`, `nome`, `email`, `senha`).
*   **`places`**: Pontos turísticos registrados pelos usuários (`id`, `nome`, `cidade`, `latitude`, `longitude`, `categoria`, `imagem_url`, `usuario_id`).
*   **`reviews`**: Avaliações enviadas pelos internautas vinculadas ao ponto turístico (`id`, `place_id`, `usuario_id`, `nome_usuario`, `comentario`, `pontuacao`).
*   **`place_images`**: Suporta múltiplos arquivos de fotos para um mesmo local (`id`, `place_id`, `image_url`).

---

## 📖 Documentação dos Endpoints e Funções

### 🔐 Autenticação e Usuários

#### `POST /auth/register`
*   **Descrição:** Cadastra um novo usuário no sistema.
*   **Regra de Negócio:** O campo `email` possui uma restrição `UNIQUE`. Caso ocorra tentativa de duplicidade, o SQLite retorna um erro tratado com status `400`.

#### `POST /auth/login`
*   **Descrição:** Valida o par de credenciais (`email` e `senha`) informados.
*   **Regra de Negócio:** Se o usuário não for encontrado ou os dados estiverem incorretos, retorna o status `401 (Unauthorized)`.

### 📍 Gerenciamento de Pontos Turísticos (`places`)

#### `GET /places`
*   **Descrição:** Retorna a listagem de locais disponíveis.
*   **Funcionalidade Opcional:** Permite buscas via Query Params (Ex: `/places?nome=cristo`). A busca converte os textos em minúsculo usando a instrução `LOWER(nome) LIKE LOWER(?)` para evitar problemas de case-sensitivity.

#### `POST /places`
*   **Descrição:** Registra um ponto turístico e faz upload de até 10 fotos simultâneas.
*   **Middleware Embutido:** `multer({ storage }).array('imagem', 10)` salva os arquivos na pasta `uploads/` renomeando-os com um carimbo de data (`Date.now()`).
*   **Regras de Negócio:** 
    1. Impede a duplicação se já existir um ponto turístico com o mesmo nome na mesma cidade (`status 400`).
    2. Insere os dados principais na tabela `places` e depois itera os arquivos inserindo caminhos como `/uploads/nome_da_foto.jpg` na tabela `place_images`.

#### `PUT /places/:id`
*   **Descrição:** Altera as informações cadastrais de um local.
*   **Regras de Negócio:** 
    1. Verifica a existência do local (`status 404`).
    2. Compara se o `usuario_id` enviado no corpo da requisição é idêntico ao proprietário original do registro no banco (`status 403 - Forbidden`), protegendo contra edições não autorizadas.
    3. Atualiza os dados de texto e insere novas fotos na tabela de mídias caso sejam enviadas.

#### `DELETE /places/:id`
*   **Descrição:** Remove permanentemente um ponto turístico do sistema.
*   **Regras de Negócio:** Exige o envio do `usuario_id` no corpo da requisição e valida a propriedade do registro antes de efetivar o comando `DELETE`. Se o ID não for correspondente, barra a operação com status `403`.

#### `GET /places/:id`
*   **Descrição:** Retorna os dados completos e consolidados de um local.
*   **Agrupamento Assíncrono:** Executa três buscas aninhadas ao SQLite em sequência. Coleta os dados do lugar, junta o array contendo os caminhos de suas respectivas fotos em `place_images` e, por fim, anexa a lista de comentários em `reviews` antes de enviar o JSON final ao cliente.

---

## 🛠️ Configurações Importantes de Middleware

*   **Serviço de Arquivos Estáticos:** A linha `app.use('/uploads', express.static(...))` expõe publicamente a pasta de uploads para que o navegador do cliente front-end consiga carregar as imagens diretamente por meio de URLs absolutas (ex: `http://localhost:5000/uploads/imagem.png`).


* Resumo Geral * 

├── backend/          # Servidor Node.js + SQLite
│   ├── uploads/      # Pasta para armazenamento das imagens
│   ├── app.js        # Código do servidor
│   └── turismo.db    # Banco de dados gerado automaticamente
└── frontend/         # Interface SPA em React
    ├── src/
    │   ├── App.js    # Componente principal do sistema
    │   └── App.css   # Estilização da interface
    └── package.json




