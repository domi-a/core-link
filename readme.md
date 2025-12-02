# CoreLink

## what is CoreLink ?

### intended to connect a hardware gift with a virtual message / gift card - and also meant to be reused

instead of only saying it or writing "thank you" or "respect" or sth on a sheet of paper > use a valueable hardware thing + a personal message with animated picture

![hardware coins](/misc/images/coins.png)
![main view](/misc/images/main-view.png)
![edit view](/misc/images/edit.png)
![gif search view](/misc/images/gif-serach.png)

## development

workspaceFolder = ./server
local development uses a in memory database with seeds

- `npm run gen-routes` generate routes
- `npm run server` start server
- `server-with-api` will generate routes and start server
- `npm run server-watch` start with automatic restart after code changes

## deployment

- `npm run build`
- copy content of dist folder to server folder
- `docker compose up -d --build`
- will use `.env.prod` or docker compose enviroment (i use `docker-compose.override.yaml`) for diffrent environment variables
- will use `stageStart` to execute server
- will start 3 docker containers: web-service, database, database-admin
