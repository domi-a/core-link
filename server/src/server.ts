/** @format */

import express, { json } from 'express';
// import swaggerUi from 'swagger-ui-express';
// import apiDef from '../generated/swagger.json';
import path from 'path';
import { RegisterRoutes } from '../generated/routes';
import { config } from './config/config';
import { registerIocDependencies } from './config/setup';
import { ViewController } from './controllers/viewController';
import { apiErrorHandler, viewErrorHandler } from './middlewares/errorHandler';
import { MongoDBMemoryServer } from './persistance/memDB';
import { MongoDB } from './persistance/mongoDB';
let dbClose: any;

registerIocDependencies();
initDb().then(() => {
  initApp();
  process.on('exit', function () {
    dbClose();
    console.log('on exit');
  });
});

function initDb() {
  if (config.stage === 'local') {
    return MongoDBMemoryServer.initMemDB().then(({ close }) => {
      dbClose = close;
      MongoDBMemoryServer.seed();
    });
  } else {
    return MongoDB.initDB(config.dbConnection).then(({ close }) => {
      dbClose = close;
    });
  }
}

function initApp() {
  const app = express();
  //static
  app.use('/', express.static(path.join(__dirname, 'public')));
  //api
  app.use(json());
  app.use(express.urlencoded({ extended: true }));
  RegisterRoutes(app);
  app.use(apiErrorHandler);
  // views
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, './views'));
  new ViewController(app);
  app.use(viewErrorHandler);
  //app
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    config.stage === 'local' &&
      console.log('example entry', `http://localhost:${config.port}/view/222`);
  });
}
