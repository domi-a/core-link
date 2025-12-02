/** @format */

import { Entity } from 'monguito';

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
