# 🌌 inOrbit API

> API REST desenvolvida com **NestJS**, **Prisma** e **PostgreSQL**. Inclui autenticação via GitHub OAuth, gerenciamento de metas e tarefas, além de testes unitários e de integração para garantir confiabilidade.

![Status](https://img.shields.io/badge/status-estável-2ECC71?style=flat-square)

---

## ✨ Sobre o projeto

A **inOrbit API** é uma aplicação back-end desenvolvida para o gerenciamento de metas pessoais, permitindo integração com OAuth, controle de tarefas e acompanhamento de progresso individual.

Com ela, você pode:

- [x] Criar conta via **GitHub OAuth**
- [x] Cadastrar **metas**
- [x] Registrar **hábitos diários** e acompanhar o progresso
- [x] Gerenciar **tarefas com status**
- [x] Visualizar **métricas de desempenho pessoal**

---

## 🚀 Tecnologias

- [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com) - Framework Node.js moderno e escalável.
- [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/) - ORM para modelagem e migrações de banco de dados.
- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) - Banco de dados relacional robusto e confiável.
- [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/) - Autenticação baseada em tokens.
- [![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/) - Documentação automática da API.
- [![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/) - Validação de esquemas.
- [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) - Tipagem estática e segurança no código.
- [![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/) - Testes rápidos e integrados ao ecossistema Vite.

---

## 📦 Instalação

1. Clone o repositório e acesse o diretório do projeto:

```bash
git clone https://github.com/oliveiradniel/in.orbit-server.git
cd in.orbit-server
```

2. Instale as dependências:

```bash
yarn
```

3. Copie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

> 💡 **Dica:** adicione o arquivo `.env` ao `.gitignore` para evitar o versionamento de dados sensíveis.

---

## 📄 Variáveis de Ambiente

O projeto utiliza um arquivo `.env` com as seguintes variáveis:

| Nome                   | Descrição                           | Exemplo                                                                                 |
| ---------------------- | ----------------------------------- | --------------------------------------------------------------------------------------- |
| `PORT`                 | Porta usada para rodar o servidor   | `3000`                                                                                  |
| `HOST`                 | Host da conexão                     | `127.0.0.1`                                                                             |
| `FRONTEND_ORIGIN`      | Origem permitida pela política CORS | `http://localhost:5173`                                                                 |
| `POSTGRES_PORT`        | Porta usada pelo banco PostgreSQL   | `5432`                                                                                  |
| `POSTGRES_HOST`        | Host do banco de dados              | `pg`                                                                                    |
| `POSTGRES_USER`        | Usuário do banco PostgreSQL         | `postgres_user`                                                                         |
| `POSTGRES_PASSWORD`    | Senha do banco PostgreSQL           | `postgres_password`                                                                     |
| `POSTGRES_DB`          | Nome do banco de dados              | `my_database`                                                                           |
| `DATABASE_URL`         | URL de conexão com o banco          | `postgresql://postgres_user:postgres_password@localhost:5432/my_database?schema=public` |
| `GITHUB_CLIENT_ID`     | ID gerado pelo GitHub para OAuth    | `AIzaSy...`                                                                             |
| `GITHUB_CLIENT_SECRET` | Chave secreta gerada pelo GitHub    | `AKIA...`                                                                               |
| `JWT_SECRET`           | Chave usada para assinar tokens JWT | `unsecure_jwt_secret`                                                                   |
| `NODE_ENV`             | Define o ambiente de execução       | `development`                                                                           |

> ⚠️ A variável `JWT_SECRET` deve conter uma chave forte e segura.

---

## 🐳 Usando PostgreSQL com Docker

Esta aplicação utiliza **PostgreSQL** via **Docker Compose**.
Para subir o banco de dados, execute:

```bash
docker-compose up -d
```

A imagem da API está comentada no arquivo `docker-compose.yml`.
Caso queira executá-la junto ao banco, basta descomentar e ajustar o `env_file` conforme suas variáveis de ambiente.

---

## 📤 Prisma e Migrações

Após configurar o banco, gere os arquivos do Prisma e aplique as migrações:

```bash
npx prisma generate
npx prisma migrate dev
```

---

## 💻 Executando em modo de desenvolvimento

```bash
yarn start:dev
```

> Certifique-se de que o banco de dados e as variáveis de ambiente estão configurados corretamente antes de iniciar o projeto.

---

## 🧪 Testes

O projeto inclui **testes unitários e de integração** usando **Vitest**.

Para rodar todos os testes:

```bash
yarn test
```

Para rodar os testes unitários:

```bash
yarn test:unit
```

Para rodar os testes de intergração:

```bash
yarn test:int
```

## 📚 Documentação da API

Após iniciar o servidor, acesse a documentação interativa com Swagger em:
👉 **http://localhost:3000/docs**

---

## 🔗 Links

[![Deploy](https://img.shields.io/badge/🧑🏻‍💻_aplicação_em_tempo_real-8E51FF?style=for-the-badge&logo=windows-terminal&logoColor=white)](https://app.inorbit.site/login)

[![Repositório Front-End](https://img.shields.io/badge/repositório_front_end-0a1123?style=for-the-badge&logo=github&logoColor=white)](https://github.com/oliveiradniel/in.orbit-web)

[![Portfólio](https://img.shields.io/badge/meu_portfólio-00A6F4?style=for-the-badge&logo=google-earth&logoColor=white)](https://jovemprogramador.dev/)
