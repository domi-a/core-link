/** @format */

import express, { Express, json } from 'express';
import { Server } from 'http';
import path from 'path';
import { RegisterRoutes } from '../generated/routes';
import { config } from './config/config';
import { ViewController } from './controllers/viewController';
import {
  apiErrorHandler,
  sanitizeBody,
  viewErrorHandler,
} from './middlewares/errorHandler';

let server: Server;

export const initExpress = () =>
  new Promise<Express>((resolve, reject) => {
    const app = express();
    //static
    app.use('/', express.static(path.join(__dirname, 'public')));
    //api
    app.use(json());
    app.use(express.urlencoded({ extended: true }));
    RegisterRoutes(app);
    app.use(sanitizeBody);
    app.use(apiErrorHandler);
    // views
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, './views'));
    new ViewController(app);
    app.use(viewErrorHandler);

    server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      resolve(app);
    });
    return server;
  });

export const closeExperss = () => {
  server.close();
};
