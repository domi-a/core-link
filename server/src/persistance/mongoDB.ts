/** @format */

import mongoose from 'mongoose';

export class MongoDB {
  static initDB = async (uri: string, dbName: string) => {
    const conn = await mongoose.connect(uri, {
      dbName,
    });
    console.log('db connected to:', conn.connection.db?.databaseName);
    return { db: conn.connection?.db, uri: uri, close: this.closeDB };
  };

  static closeDB = async () => {
    await mongoose.disconnect();
    console.log('db disconnected');
  };
}
