/** @format */

import { BaseSchema, Entity, extendSchema } from 'monguito';

export class CoreLinkEntity implements Entity {
  readonly id?: string;
  guid: string;
  from: string;
  to: string;
  text: string;
  fixatedTill: Date | undefined;
  imageUrl: string | null;
  secret: string | null;
  reads: Number | null;
  writes: Number | null;
  constructor(data: Omit<CoreLinkEntity, 'id'>) {
    this.guid = data.guid;
    this.from = data.from;
    this.to = data.to;
    this.fixatedTill = data.fixatedTill;
    this.text = data.text;
    this.imageUrl = data.imageUrl;
    this.secret = data.secret;
    this.reads = data.reads || 0;
    this.writes = data.writes || 0;
  }
}

export const CoreLinkSchema = extendSchema(
  BaseSchema,
  {
    guid: { type: String, required: true, maxLength: 40 },
    from: { type: String, required: true, maxLength: 128 },
    to: { type: String, required: true, maxLength: 128 },
    fixatedTill: { type: Date, required: false },
    text: { type: String, required: false, maxLength: 2048 },
    imageUrl: { type: String, required: false, maxLength: 1024 },
    secret: { type: String, required: false, maxLength: 40 },
    reads: { type: Number, required: false, maxLength: 10000 },
    writes: { type: Number, required: false, maxLength: 1000 },
  },
  {
    timestamps: true,
  }
);
export const blankPlaceHolder = '#*#'; //do not change after writing with it to DB
