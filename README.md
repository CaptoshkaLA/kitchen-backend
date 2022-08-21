Development instructions
===

Install dependencies
---

run `npm install`

Set up environment variables
---

create a *.env* file at the root of the project

configure it as below

```
DATABASE_URL="postgresql://<username>:<password>@<host_name>:<port>/<database_name>?schema=public"
PORT=<port_number>(default: 80 - Windows | 8080 - Linux)
JWT_secret=<secter_token_string>
JWT_expire=<expiration_time> (ex.: 1m)
```

Run the project locally
---

run `npm run devStart`
