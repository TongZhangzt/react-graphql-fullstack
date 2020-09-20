# React + Express.js + Graghql Fullstack Demo App

A full-stack blog-post web app built with React.js(Typescript) + Redux on the frontend side and Express.js + GraphQL + MySQL/SQLite on the backend side.

#### 高仿简书 PC 端 UI，练手 Demo 项目，代码仅供学习和交流

## Getting Started

### Run API server with SQLite Database

```bash
$ npm install
$ npm start
$ open http://localhost:8080
```

### Run API server with MySQL Database

1. Install, config and run MySQL database on you locally environment
2. Create a database and import the sql file under `/server/api_server/database.sql`
3. Update the `DB_TYPE`,`DB_NAME`, `DB_USER`, `DB_PASSWORD` in the `.env` file
4. Run the above commands

- After running, you can tryout the API and view the document at `http://localhost:4000/graphql`
- You can update the mock data in `/server/api_server/database/mock.js` file

## Project Structure

```
├── public                                  # static resources
│  └──img                                   # images and favicon
├── server
│   ├── api_server                          # API server
│   │   ├── database
│   │   │   ├── config.js                   # database config
│   │   │   ├── mock.js                     # create mock data when using SQLite
│   │   │   └──  model.js                   # define sequelize models
│   │   ├── graphql
│   │   │   ├── context.js                  # graphql server context
│   │   │   ├── resolvers.js                # graphql server resolvers
│   │   │   └── schema.js                   # graphql server schema
│   │   ├── routes
│   │   │   ├── login.js                    # privide user login service, using jwt
│   │   │   └── logout.js                   # privide user logout service
│   │   └── index.js                        # API server set-up and config
│   ├── web_server
│   │   └──  index.js                       # web server setup with Parcel.js
├── src
│   ├── api                                 # client side Graphql
│   │   ├── interfaces.ts                   # defines interfaces used in graphql
│   │   ├── schema.ts                       # defines graphql schema
│   │   ├── mutations.ts                    # defines graphql schema
│   │   ├── queries.ts                      # defines graphql schema
│   ├── pages                               # routing pages
│   │   └── router.tsx                      # router config and setup
│   ├── components                          # common UI components
│   │   └──  AuthComponent                  # routing authentication component
│   ├── store                               # Redux setup
│   ├── utils
│   │   ├── types.ts                        # define interfaces
│   │   └── environments.ts                 # read enviroment config from .env
│   └── index.tsx                           # launch the app
├── .env                                    # environment variables of the whole app
└── tsconfig.json                           # typescript configuration
```

## Features

- [x] User Register/Login and Authentication Persistence
- [x] Browse Popular Posts
- [x] Post Detail Page
- [x] User detail page
- [x] Add Posts
- [x] Comment/Like a Post
- [x] Update User Profile

## Dependencies

1. Apollo - Graphql third party library
2. Ant Design - UI component library
3. Parcel.js - Web application bundler
4. Redux - State management
5. express - Web application server
6. sequelize - ORM for Node.js
