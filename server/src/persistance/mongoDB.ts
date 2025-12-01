/** @format */

import mongoose from 'mongoose';

export class MongoDB {
  static initDB = async (mongoUri: string) => {
    const conn = await mongoose.connect(`${mongoUri}`);
    console.log('db connected to:', conn.connection.db?.databaseName);
    return { db: conn.connection?.db, uri: mongoUri, close: this.closeDB };
  };

  static closeDB = async () => {
    await mongoose.disconnect();
    console.log('db disconnected');
  };
}
