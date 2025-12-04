# CoreLink

## what is CoreLink ?

### intended to connect a hardware gift with a virtual message / gift card - and also meant to be reused

instead of only saying it or writing "thank you" or "respect" or sth on a sheet of paper > use a valueable hardware thing + a personal message with animated picture

### how it works

the hardware is a 3d printed coin like thing with a integrated nfc-tag. This tag stores the link for the web system. each link i a hardware is unique. the content is only stored inside the web-service. urls are unique and can not be quessed nor are they publicly listed. just as private a shared photo album link

### how it looks

![hardware coins](/misc/images/coins.png)
![main view](/misc/images/main-view.png)
![edit view](/misc/images/edit.png)
![gif search view](/misc/images/gif-serach.png)

## produce hardware

### source nfc tags

before producing hardware items you need nfc-tags. cheap ones that are known to work [Ntag 213 on aliexpress](https://de.aliexpress.com/item/1005008604718409.html) round ones or square ones (wet means with adhesive)

### print coins

- used font is not free for commercial use! [sf viper squadron](https://www.1001fonts.com/viper-squadron-font.html#license)
- icons are standard unicode emojis
- rest of models is by me
- [orca project](./misc/3dprint/print.3mf) (for round 25mm nfg-tags)
- the objects are assembled from 4 parts, so you could remove / replace any in an easy way
  ![print project](./misc/3dprint/print-project.png)
- if you want to place your own stuff on the outer ring consider using diameter from 35.2mm to 44mm

### after creating a hardware thing

you need nfc tools on your phone to write the created link to the nfc-tag [android](https://play.google.com/store/apps/details?id=com.wakdev.wdnfc) / [iphone](https://apps.apple.com/us/app/nfc-tools/id1252962749)

## host own service

### set enviroment variables

stored in .env.\* or docker-compose files (use whatever you like)

- `.env.base` shared envs
- `.env.local` used only for local development (not part of repo)
- `.env.prod` could be used for production (not part of repo)
- `docker-compose.yaml` base settings for deployment
- `docker-compose.override.yaml` file i use additionally and store my production envs in (not part of repo)

minimum keys to change

- `HOST` > the domain/url your service is reachable
- `TENOR_KEY` > tenor api_key
- `APP_TITLE` > title of your service

### development

workspaceFolder = ./server
local development uses a in memory database with seeds

- obligatory `npm i`
- `npm run gen-routes` generate routes
- `npm run server` start server
- `server-with-api` will generate routes and start server
- `npm run server-watch` start with automatic restart after code changes

### deployment

- `npm run build`
- copy content of dist folder to server folder
- `docker compose up -d --build`
- will use `stageStart` to execute server
- will start 3 docker containers: web-service, database, database-admin
