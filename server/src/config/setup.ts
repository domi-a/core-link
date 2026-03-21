/** @format */

import { Express } from 'express';
import { closeExperss, initExpress } from '../app';
import { GifSearchController } from '../controllers/gifSearchController';
import { CoreLinkRepository } from '../persistance/coreLinkRepo';
import { MongoDBMemoryServer } from '../persistance/memDB';
import { MongoDB } from '../persistance/mongoDB';
import { CoreLinkService } from '../services/coreLinkService';
import { KlipyService } from '../services/klipyService';
import { TenorService } from '../services/tenorService';
import { config } from './config';
import { iocContainer } from './ioc';

export let dbClose: () => Promise<void>;
export let expessApp: Express;

export async function initialize() {
  registerIocDependencies();
  await initDb();
  process.on('exit', function () {
    dbClose();
  });
  expessApp = await initExpress();
  return expessApp;
}
export async function shutdown() {
  await dbClose();
  closeExperss();
}

export function registerIocDependencies() {
  [
    CoreLinkRepository,
    CoreLinkService,
    TenorService,
    KlipyService,
    GifSearchController,
  ].forEach((item) => {
    try {
      iocContainer.register(item, () => {
        return new item();
      });
    } catch (e) {
      console.error('error ioc setup', e);
    }
  });
}

export async function initDb() {
  if (config.stage === 'local') {
    return await MongoDBMemoryServer.initMemDB().then(({ close }) => {
      dbClose = close;
      return MongoDBMemoryServer.seed();
    });
  } else if (config.stage === 'test') {
    return await MongoDBMemoryServer.initMemDB().then(({ close }) => {
      dbClose = close;
      return MongoDBMemoryServer.testSeed();
    });
  } else {
    return await MongoDB.initDB(config.dbConnection, config.dbName).then(
      ({ close }) => {
        dbClose = close;
      }
    );
  }
}
