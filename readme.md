# CoreLink

workspaceFolder = ./server

## development

- `npm run gen-routes` generate routes
- `npm run server` start server
- `server-with-api` will generate routes and start server
- `npm run server-watch` start with automatic restart after code changes

## deployment

- `npm run build`
- copy content of dist folder to server folder
- `docker compose up -d --build`
- will use `.env.prod` or docker compose enviroment for diffrent values
- will use `stageStart` to execute server
- will start 3 docker container: web-service, database, database-admin
