/** @format */

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { iocContainer } from '../ioc';
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
    from: 'CoreLink1',
    to: 'john doe',
    fixatedTill: date,
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    imageUrl:
      'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzYxb2U5ZHQzMXVrbTk4YmlwNzFxMmt4ZnU1Zzd1YmxzMzZ0djN5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EOILoGqhsYt3t2U28a/giphy.gif',
    secret: null,
    reads: null,
    writes: null,
  }),
  new CoreLinkEntity({
    guid: '222',
    from: 'CoreLink2',
    to: 'CyberGirl',
    fixatedTill: undefined,
    text: 'Lorem ipsum dolor sit amet',
    imageUrl:
      'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGhiaHNrNm85dHMzbnAwcmVjZTRqbmVrMGg5ODVjemFydmQ5eWlqeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OfkGZ5H2H3f8Y/giphy.gif',
    secret: '123',
    reads: 10,
    writes: 10,
  }),
];
