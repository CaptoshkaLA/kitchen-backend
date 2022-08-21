Development instructions
===

🚀 1.Install dependencies
---

Run `npm install`

🚀 2.Set up environment variables
---

Create a *.env* file at the root of the project

Configure it as below

```
DATABASE_URL="postgresql://<username>:<password>@<host_name>:<port>/<database_name>?schema=public"
PORT=<port_number>(default: 80 - Windows | 8080 - Linux)
JWT_secret=<secter_token_string>
JWT_expire=<expiration_time> (ex.: 1m)
```

🚀 3.Run the project locally
---

Run `npm run devStart`

Tools
===

🛠️ Development
---

- The Prisma ORM [Prisma.io](https://www.prisma.io/) was used to simplify working with the db
- The PostgreSQL [https://www.postgresql.org/](https://www.postgresql.org/) was used to store data
- Upon authorization or registration, the user receives a token. When new requests come, they are verified with middleware
- Endpoints are logically divided into routes (users, dishes, daily-dishes e.t.c) and moved to different files

🛠️ Technologies used
---

- [NodeJs](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/) 
- [JSON Web Token](https://www.npmjs.com/package/jsonwebtoken)
- [Swagger](https://swagger.io/) 
- [Helmet/Cors](https://github.com/helmetjs/helmet/)
- [Debugger](https://nodejs.org/api/debugger.html)
- [Winston Logger](https://www.npmjs.com/package/winston)
