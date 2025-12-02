/** @format */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { iocContainer } from '../config/ioc';
import { CoreLinkRepository } from './coreLinkRepo';
import { CoreLinkEntity } from './models/coreLinkEntity';

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
    console.log('memdb stopped');
  };

  static seed = async () => {
    const repo = iocContainer.get<CoreLinkRepository>(CoreLinkRepository);
    if (repo) {
      for (const seed of seeds) {
        await repo.save(seed);
      }
      // console.log(
      //   'seeded to Memory DB',
      //   JSON.stringify(await repo.findAll(), null, 2)
      // );
    }
  };
}
const date = new Date();
date.setDate(date.getDate() + 30);
const seeds: CoreLinkEntity[] = [
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
    fixatedTill: undefined,
    text: "Lorem ❤️ipsum dolor🫴 sit amet🤣 <script>console.log('!! danger zone !!')</script> sadf 👊",
    imageUrl:
      'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGhiaHNrNm85dHMzbnAwcmVjZTRqbmVrMGg5ODVjemFydmQ5eWlqeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OfkGZ5H2H3f8Y/giphy.gif',
    secret: '123',
    reads: 10,
    writes: 10,
  }),
];
