/** @format */

import { TenorController } from '../controllers/tenorController';
import { CoreLinkRepository } from '../persistance/coreLinkRepo';
import { MongoDBMemoryServer } from '../persistance/memDB';
import { MongoDB } from '../persistance/mongoDB';
import { CoreLinkService } from '../services/coreLinkService';
import { TenorService } from '../services/tenorService';
import { config } from './config';
import { iocContainer } from './ioc';

let dbClose: any;

export async function initDependencies() {
  registerIocDependencies();
  await initDb();
  listenOnExit();
}

export function registerIocDependencies() {
  [CoreLinkRepository, CoreLinkService, TenorService, TenorController].forEach(
    (item) => {
      try {
        iocContainer.register(item, () => {
          return new item();
        });
      } catch (e) {
        console.error('error ioc setup', e);
      }
    }
  );
  console.log('ioc ready');
}

function initDb() {
  if (config.stage === 'local') {
    return MongoDBMemoryServer.initMemDB().then(({ close }) => {
      dbClose = close;
      MongoDBMemoryServer.seed();
      console.log('example entry', `http://localhost:${config.port}/view/222`);
    });
  } else {
    return MongoDB.initDB(config.dbConnection).then(({ close }) => {
      dbClose = close;
    });
  }
}
function listenOnExit() {
  process.on('exit', function () {
    dbClose();
    console.log('exit');
  });
}
