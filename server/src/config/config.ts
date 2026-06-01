/** @format */
import { CoreLinkCreate } from '../services/coreLinkService';

const fallbackConfig = {
  port: 3000,
  stage: 'local',
  dbConnection: 'mongodb://myUser:pw@myMongo:27017', // not used for local or test
  dbName: 'test',
  viewHost: 'http://localhost:3000', // to be replaced
  appTitle: 'CoreLink', // to be replaced
  klipyKey: 'myKlipyApiKey', // to be replaced
  defaultImageUrl:
    'https://static.klipy.com/ii/d7aec6f6f171607374b2065c836f92f4/af/16/LChwqHWC.gif',
  defaultFrom: 'You',
  defaultTo: 'Someone',
  defaultText:
    ' *attach a message to this coin* \r\n\
    click _change this entry_ in menu to enter your own message like:\r\n\r\n\
    📃 greeting card\n\
    🫡 honor somebodys work\n\
    ♥️ say thank you\n\
    📣 share some respect\n\
    🫵 use as KUDOS-card\n\
    ⭐ highligh an achievement\n\
    🤘\n',
};

function getEnv() {
  const conf = {
    port: process.env.PORT,
    stage: process.env.STAGE,
    dbConnection: process.env.DB,
    dbName: process.env.DBNAME,
    viewHost: process.env.HOST,
    appTitle: process.env.APP_TITLE,
    klipyKey: process.env.KLIPY_KEY,
    defaultImageUrl: process.env.DEFAULT_ENTRY_IMAGEURL,
    defaultFrom: process.env.DEFAULT_ENTRY_FROM,
    defaultTo: process.env.DEFAULT_ENTRY_TO,
    defaultText: process.env.DEFAULT_ENTRY_TEXT,
  };
  return conf;
}

function getStage(stage: string): Config['stage'] {
  if (stage === 'local') return 'local';
  else if (stage === 'test') return 'test';
  else if (stage === 'prod') return 'prod';
  else throw Error('stage unknown');
}

function getConfig(): Config {
  const rawConf = getEnv();
  const conf = {
    port: Number(rawConf.port || fallbackConfig.port),
    stage: getStage(rawConf.stage || fallbackConfig.stage),
    dbConnection: rawConf.dbConnection || fallbackConfig.dbConnection,
    dbName: rawConf.dbName || fallbackConfig.dbName,
    viewHost: rawConf.viewHost || fallbackConfig.viewHost,
    appTitle: rawConf.appTitle || fallbackConfig.appTitle,
    klipyKey: rawConf.klipyKey || fallbackConfig.klipyKey,
    defaultEntry: {
      imageUrl: rawConf.defaultImageUrl || fallbackConfig.defaultImageUrl,
      from: rawConf.defaultFrom || fallbackConfig.defaultFrom,
      to: rawConf.defaultTo || fallbackConfig.defaultTo,
      text: rawConf.defaultText || fallbackConfig.defaultText,
    },
  };
  // console.log('used config stage', process.env.STAGE);
  return conf;
}

interface Config {
  port: number;
  stage: 'local' | 'prod' | 'test';
  dbConnection: string;
  dbName: string;
  viewHost: string;
  appTitle: string;
  klipyKey: string;
  defaultEntry: Omit<CoreLinkCreate, 'fixateForDays'>;
}
export const config = getConfig();
