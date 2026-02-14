/** @format */
import { CoreLinkCreate } from '../services/coreLinkService';

const fallbackConfig = {
  port: 3000,
  stage: 'local',
  dbConnection: 'mongodb://myUser:pw@myMongo:27017', // not used for local or test
  dbName: 'test',
  viewHost: 'http://localhost:3000', // to be replaced
  appTitle: 'CoreLink', // to be replaced
  tenorKey: 'myTenorApiKey', // to be replaced
  defaultImageUrl: 'https://media.tenor.com/67UlO1i1iB0AAAAC/good-fine.gif',
  defaultFrom: 'You',
  defaultTo: 'Someone',
  defaultText:
    ' *attach a message to this coin* \r\n\
    click ~change entry~ in menu to create your own:\r\n\
    🤘\r\n\
    📃 greeting card\n\
    🫡 horor somebodys work\n\
    ♥️ say thank you\n\
    📣 share some respect\n\
    ⭐ highligh an achievement\n\
    🫵use as KUDOS-card\n\
    ',
};

function getEnv() {
  const conf = {
    port: process.env.PORT,
    stage: process.env.STAGE,
    dbConnection: process.env.DB,
    dbName: process.env.DBNAME,
    viewHost: process.env.HOST,
    appTitle: process.env.APP_TITLE,
    tenorKey: process.env.TENOR_KEY,
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
    tenorKey: rawConf.tenorKey || fallbackConfig.tenorKey,
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
  tenorKey: string;
  defaultEntry: Omit<CoreLinkCreate, 'fixateForDays'>;
}
export const config = getConfig();
