/** @format */

import dotenv from 'dotenv';
import { CoreLinkCreate } from '../services/coreLinkService';

dotenv.config({ path: ['.env.local', '.env.base'] });

function getRaw() {
  const conf = {
    port: process.env.PORT,
    stage: process.env.STAGE,
    dbConnection: process.env.DB,
    viewHost: process.env.HOST,
    appTitle: process.env.APP_TITLE,
    tenorKey: process.env.TENOR_KEY,
    defaultImageUrl: process.env.DEFAULT_ENTRY_IMAGEURL,
    defaultFrom: process.env.DEFAULT_ENTRY_FROM,
    defaultTo: process.env.DEFAULT_ENTRY_TO,
    defaultText: process.env.DEFAULT_ENTRY_TEXT,
  };
  Object.entries(conf).map(([key, value]) => {
    if (value === undefined) {
      throw new Error(`read enviroment, key ${key} is not there`);
    }
  });
  return conf;
}

function getStage(stage: string): Config['stage'] {
  if (stage === 'local') return 'local';
  else if (stage === 'test') return 'test';
  else return 'prod';
}

function getConfig(): Config {
  const conf = getRaw();
  return {
    port: Number(conf.port),
    stage: getStage(conf.stage!),
    dbConnection: conf.dbConnection!,
    viewHost: conf.viewHost!,
    appTitle: conf.appTitle!,
    tenorKey: conf.tenorKey!,
    defaultEntry: {
      imageUrl: conf.defaultImageUrl!,
      from: conf.defaultFrom!,
      to: conf.defaultTo!,
      text: conf.defaultText!,
    },
  };
}

interface Config {
  port: number;
  stage: 'local' | 'prod' | 'test';
  dbConnection: string;
  viewHost: string;
  appTitle: string;
  tenorKey: string;
  defaultEntry: Omit<CoreLinkCreate, 'fixateForDays'>;
}
export const config = getConfig();
// export default getConfig()
