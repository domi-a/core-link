/** @format */

import express, { json } from 'express';
import path from 'path';
import { RegisterRoutes } from '../generated/routes';
import { config } from './config/config';
import { initDependencies } from './config/setup';
import { ViewController } from './controllers/viewController';
import { apiErrorHandler, viewErrorHandler } from './middlewares/errorHandler';

initDependencies().then(() => initApp());

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

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}
