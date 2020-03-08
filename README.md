# serve-me-java

> Build with [Strapi](https://strapi.io/)

## Tools used

- Node.js
- Npm
- Strapi
- Koa
- Bookshelf
- Mysql
- Firebase Admin SDK
- ModuleAliases

## How to use

Remember to change the config/environments/**/database.json

The mysql address should be changed to your own.

```shell
# please create a new database, name is up to you, for example: serve-me
# and set your environment param
export DB_URL={ipaddress}
export DB_USER={user}
export DB_PASSWORD={password}
export GOOGLE_APPLICATION_CREDENTIALS={path}

# for example: 
# DB_URL=localhost
# ipaddress is localhostm, port is 3306, database is serve-me
# DB_USER=root
# DB_PASSWORD=housirvip
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/firebase-admin-sdk-credentials.json

{user} is your sql username
{password} is sql password
{ipaddress} is sql address, local machine is localhost
{port} is sql port, usually is 3306
```
