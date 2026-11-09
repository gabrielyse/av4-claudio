# API de Treinos Esportivos — Carga e Risco de Sobrecarga

API REST em Node.js + Express + Sequelize (MySQL) para gerenciar jogadores, treinos, carga de treinamento e relatório semanal.

> O indicador de risco é exclusivamente didático e não corresponde a diagnóstico ou predição clínica de lesão.

## Tecnologias

- Node.js, Express
- Sequelize (dialeto `mysql`) + mysql2
- Sequelize CLI (migrations e seeders)
- dotenv (variáveis de ambiente)
- swagger-ui-express (documentação e testes pelo Swagger)

## Estrutura

```
src/
  config/database.js      # configuração do banco (lida do .env), usada pela app e pelo Sequelize CLI
  models/                 # Jogador, Treino, Configuracao + associações (models/index.js)
  migrations/             # criação das tabelas
  seeders/                # massa de dados de teste
  services/               # regras de negócio e acesso a dados (Sequelize)
  controllers/            # recebem a requisição, chamam o service e respondem em JSON
  routes/                 # definição dos endpoints
  utils/                  # calcularCarga, cálculo da semana, tratamento de erros
  docs/swagger.json       # documentação OpenAPI
  app.js / server.js
```

## Como executar

1. Instalar as dependências:
   ```bash
   npm install
   ```
2. Copiar `.env.example` para `.env` e preencher com o usuário e a senha do seu MySQL:
   ```bash
   cp .env.example .env
   ```
3. Criar o banco, as tabelas e inserir os dados de teste:
   ```bash
   npm run db:create
   npm run db:migrate
   npm run db:seed
   ```
4. Iniciar a API:
   ```bash
   npm start
   ```
5. Acessar o Swagger em **http://localhost:3000/api-docs**.

## Estratégia de criação das tabelas

As tabelas são criadas por **migrations com Sequelize CLI** (`src/migrations`). Cada migration tem `up` (cria a tabela) e `down` (desfaz). Não é usado `sync()` nem `sync({ force: true })`, então os dados existentes nunca são apagados ao iniciar a aplicação. O arquivo `.sequelizerc` aponta o CLI para as pastas dentro de `src`.

A chave estrangeira `treinos.jogadorId` usa `onDelete: RESTRICT`, e o jogador é apenas **desativado** (`ativo = false`), nunca apagado — o histórico de treinos é preservado.

## Modelagem

| Model | Atributos |
|---|---|
| Jogador | id, nome, posicao (ENUM G, Z, M, A), ativo |
| Treino | id, codigo (UNIQUE), jogadorId (FK), dataTreino, tipo (ENUM F, T, E), duracaoMin, intensidade, carga |
| Configuracao | id, cargaMaximaSemanal, dataVigencia (opcional) |

Associações (`src/models/index.js`): `Jogador.hasMany(Treino)` e `Treino.belongsTo(Jogador)`.

Validações nos models: intensidade inteira de 1 a 10, duração positiva, código obrigatório e único, tipo e posição válidos.

## Regras de negócio

- Multiplicadores: Físico (F) = 1,5 · Técnico (T) = 1,2 · Estratégico (E) = 1,0
- **Carga = (duração / 10) × intensidade × multiplicador** — função reutilizável `calcularCarga()` em `src/utils/calcularCarga.js`.
- Carga semanal = soma das cargas do jogador de **segunda a domingo** da semana que contém a data informada.
- **RISCO DE SOBRECARGA** somente quando a carga semanal for **estritamente maior** que o limite configurado. No empate, não há risco.

## Endpoints

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | /jogadores | Cadastrar atleta |
| GET | /jogadores | Listar atletas (filtro opcional `?posicao=`) |
| GET | /jogadores/:id | Consultar atleta |
| PUT | /jogadores/:id | Atualizar atleta |
| PATCH | /jogadores/:id/desativar | Desativar atleta |
| GET / PUT | /configuracao | Consultar ou cadastrar/atualizar o limite |
| POST | /treinos | Registrar sessão |
| GET | /treinos | Listar e filtrar (`jogadorId`, `tipo`, `dataInicio`, `dataFim`) |
| GET | /treinos/jogador/:id | Treinos do atleta |
| DELETE | /treinos/:codigo | Excluir sessão |
| GET | /relatorios/semanal?data=AAAA-MM-DD | Consolidar semana |

Códigos HTTP: 200 (sucesso), 201 (criado), 400 (dados inválidos / jogador inativo), 404 (não encontrado), 409 (código duplicado), 500 (erro interno, com mensagem genérica sem detalhes do banco).

## Relatório semanal

Retorna: total de treinos, carga e número de treinos por jogador (com a situação de risco), maior carga semanal, menor carga semanal, quantidade de jogadores em risco, carga média por tipo (F, T, E) e, por posição, quantidade de treinos e carga média por sessão.

- **Critério dos rankings:** consideram apenas jogadores com pelo menos um treino na semana (informado no campo `criterio`).
- **Empates:** `maiorCargaSemanal` e `menorCargaSemanal` são listas; se houver empate, todos os empatados aparecem.
- **Semana sem treinos:** `totalTreinos = 0`, listas vazias, médias 0 e `mensagem: "Nenhum treino registrado nesta semana."`.

## Massa de dados de teste (seeders)

- 6 atletas cobrindo as 4 posições (G, Z, Z, M, M, A).
- 20 treinos com os três tipos: 12 na semana de 05/10/2026 a 11/10/2026 e 8 na semana de 12/10/2026 a 18/10/2026.
- Limite semanal configurado em **200**.

Resultado esperado:

| Jogador | Semana 05/10 | Semana 12/10 |
|---|---|---|
| Carlos Silva (G) | 108 | 30 |
| Bruno Souza (Z) | **213,5 — RISCO** | 43,2 |
| Rafael Lima (Z) | 74,4 | **222 — RISCO** |
| Diego Alves (M) | **205,2 — RISCO** | 42 |
| Lucas Pereira (M) | 27 | 165,6 |
| Thiago Costa (A) | 63 | 63 |

## Roteiro de testes (pelo Swagger)

1. **Validação manual da carga:** `POST /treinos` com
   `{"codigo":"TR021","jogadorId":1,"dataTreino":"2026-10-14","tipo":"F","duracaoMin":60,"intensidade":8}`
   → cálculo manual: (60 / 10) × 8 × 1,5 = **72**. A API retorna `"carga": 72`.
2. **Código duplicado:** repetir a requisição acima → **409**.
3. **Intensidade inválida:** `"intensidade": 11` → **400**.
4. **Duração não positiva:** `"duracaoMin": 0` → **400**.
5. **Atleta inexistente:** `"jogadorId": 999` → **404**.
6. **Atleta inativo:** `PATCH /jogadores/{id}/desativar` e depois registrar treino para ele → **400**.
7. **Duas semanas diferentes:** `GET /relatorios/semanal?data=2026-10-05` e `?data=2026-10-15` → comparar indicadores por atleta, tipo e posição (semana 1: 2 atletas em risco; semana 2: 1 atleta em risco).
8. **Excluir treino:** `DELETE /treinos/TR021` → 200; repetir → **404**.
9. **Falha sem vazar credenciais:** com o banco desligado, as rotas retornam `500 {"erro":"Erro interno do servidor."}`; se a senha do `.env` estiver errada, o servidor exibe apenas uma mensagem genérica ao iniciar.

As evidências (prints das requisições e respostas) devem ser capturadas no Swagger em `/api-docs`.

## Onde Sequelize e async/await foram utilizados

- **Models e associações** (`src/models`): `sequelize.define` com `DataTypes` e validações; `hasMany` / `belongsTo`.
- **Migrations e seeders** (`src/migrations`, `src/seeders`): `queryInterface.createTable`, `bulkInsert`, em funções `async up/down`.
- **Services** (`src/services`), todos com `async/await`:
  - `cadastrarJogador()` → `Jogador.create()`
  - `listarJogadores()` → `Jogador.findAll()`
  - `buscarJogador()` → `Jogador.findByPk()`
  - `atualizarJogador()` → `instancia.update()`
  - `desativarJogador()` → `instancia.update({ ativo: false })`
  - `registrarTreino()` → `findByPk` do jogador, `Treino.build` + `validate()`, `calcularCarga()` e `save()`
  - `listarTreinos()` → `Treino.findAll()` com `include` (Jogador) e `where` (`Op.between`, `Op.gte`, `Op.lte`)
  - `excluirTreino()` → `Treino.findOne()` + `instancia.destroy()` (404 se não existir)
  - `consultarConfiguracao()` / `atualizarConfiguracao()` → `findOne`, `create`, `update`
  - `gerarRelatorioSemanal()` → `Treino.count()`, `findAll` com `fn('SUM')`, `fn('COUNT')`, `fn('AVG')`, `col`, `group`, `include` e `Op.between`
- **Controllers** (`src/controllers`): funções `async` com `try/catch`, que aguardam (`await`) os services e respondem em JSON com o status HTTP adequado; erros são tratados por `src/utils/tratarErro.js`.
- **server.js**: `await sequelize.authenticate()` antes de iniciar o servidor.
