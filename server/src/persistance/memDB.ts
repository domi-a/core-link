/** @format */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { iocContainer } from '../config/ioc';
import { getDateInDays, getViewUrl } from '../utils';
import { CoreLinkRepository } from './coreLinkRepo';
import { blankPlaceHolder, CoreLinkEntity } from './models/coreLinkEntity';

export class MongoDBMemoryServer {
  static mongoServer: MongoMemoryServer | undefined;
  public static db: mongoose.mongo.Db | undefined;

  static initMemDB = async () => {
    this.mongoServer = await MongoMemoryServer.create({});
    const mongoUri = this.mongoServer.getUri().slice(0, -1);
    const conn = await mongoose.connect(`${mongoUri}/entrys`);
    await conn.connection?.db?.dropDatabase();
    this.db = conn.connection?.db;
    console.log('mem db started and connected', mongoUri);
    return { db: conn.connection?.db, uri: mongoUri, close: this.closeDB };
  };

  static closeDB = async () => {
    await mongoose.disconnect();
    await this.mongoServer?.stop();
    // console.log('memdb stopped');
  };

  static seed = async () => {
    const repo = iocContainer.get<CoreLinkRepository>(CoreLinkRepository);
    if (repo) {
      for (const seed of defaultSeeds) {
        await repo.save(seed);
      }
      console.log(
        'seeded default entries - try with',
        defaultSeeds.map((s) => getViewUrl(s.guid))
      );
    }
  };
  static testSeed = async () => {
    const repo = iocContainer.get<CoreLinkRepository>(CoreLinkRepository);
    if (repo) {
      for (const seed of testSeeds) {
        await repo.save(seed);
      }
    }
  };
}

const defaultSeeds: CoreLinkEntity[] = [
  new CoreLinkEntity({
    guid: '111',
    from: 'john doe',
    to: 'jane doe',
    fixatedTill: undefined,
    text: "hi jane.\rjust wanted to say: i'm happy that you are there.\r\nhope to code with you again soon.\rcheckout our topic on google.com or http://google.org or https://google.de",
    imageUrl:
      'https://media.tenor.com/5Pdhkfq8xYEAAAAC/spongebob-cant-wait.gif',
    secret: null,
    reads: null,
    writes: null,
  }),
  new CoreLinkEntity({
    guid: '222',
    from: 'CoreLink',
    to: 'creator',
    fixatedTill: getDateInDays(30),
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut 👌 labore et dolore magna aliquyam erat, sed diam voluptua.  sdfsdf\r\n ❤️ \r\nasdas google.de end *strong* > _italic_ asdasda ~stroked~ asd',
    imageUrl:
      'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGhiaHNrNm85dHMzbnAwcmVjZTRqbmVrMGg5ODVjemFydmQ5eWlqeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OfkGZ5H2H3f8Y/giphy.gif',
    secret: '123',
    reads: 10,
    writes: 10,
  }),
  new CoreLinkEntity({
    guid: '333',
    from: blankPlaceHolder,
    to: blankPlaceHolder,
    fixatedTill: undefined,
    text: 'Thu Dec 04 2025 18:11:46 GMT+0100 (Mitteleuropäische Normalzeit)',
    imageUrl: null,
    secret: '567',
    reads: null,
    writes: null,
  }),
];

const testSeeds: CoreLinkEntity[] = [
  new CoreLinkEntity({
    guid: '666',
    from: 'john doe',
    to: 'jane doe',
    fixatedTill: undefined,
    text: "hi jane.\rjust wanted to say: i'm happy that you are there.\r\nhope to code with you again soon.\rcheckout our topic on google.com or http://google.org or https://google.de",
    imageUrl:
      'https://media.tenor.com/5Pdhkfq8xYEAAAAC/spongebob-cant-wait.gif',
    secret: null,
    reads: null,
    writes: null,
  }),
  new CoreLinkEntity({
    guid: '777',
    from: 'CoreLink',
    to: 'creator',
    fixatedTill: getDateInDays(30),
    text: ' *strong* sdfsdf  _italic_ asdasda ~stroked~  invidunt ut 👌 labore et doloroluptua.  sdfsdf\r\n ❤️ \r\nasdas \r\n👌',
    imageUrl: 'https://media2.giphy.com/media/whatever/giphy.gif',
    secret: '123',
    reads: 10,
    writes: 10,
  }),
  new CoreLinkEntity({
    guid: '888',
    from: blankPlaceHolder,
    to: blankPlaceHolder,
    fixatedTill: undefined,
    text: 'Thu Dec 04 2025 18:11:46 GMT+0100 (Mitteleuropäische Normalzeit)',
    imageUrl: null,
    secret: '567',
    reads: null,
    writes: null,
  }),
];
