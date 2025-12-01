/** @format */

import { BaseSchema, extendSchema, MongooseRepository } from 'monguito';
import { EntryNotFoundError } from '../middlewares/errorHandler';
import { CoreLinkUpdate } from '../services/coreLinkService';
import { CoreLinkEntity } from './models/coreLinkEntity';

export class CoreLinkRepository extends MongooseRepository<CoreLinkEntity> {
  constructor() {
    super({
      type: CoreLinkEntity,
      schema: CoreLinkSchema,
    });
  }
  async get(guid: string, incrementRead?: boolean) {
    const bla = !incrementRead
      ? this.entityModel.findOne({ guid })
      : this.entityModel.findOneAndUpdate(
          { guid },
          { $inc: { reads: 1 } },
          { new: true }
        );
    return bla.then((entity) => {
      const inst = this.instantiateFrom(entity);
      if (!inst) throw new EntryNotFoundError(guid);
      else return inst;
    });
  }

  async patch(guid: string, data: CoreLinkUpdate): Promise<CoreLinkEntity> {
    return this.entityModel
      .findOneAndUpdate(
        { guid },
        { ...data, reads: undefined, writes: undefined, $inc: { writes: 1 } },
        { new: true }
      )
      .then((entity) => {
        const inst = this.instantiateFrom(entity);
        if (!inst) throw new EntryNotFoundError(guid);
        else return inst;
      });
  }

  async unlock(guid: string): Promise<CoreLinkEntity> {
    return this.entityModel
      .findOneAndUpdate({ guid }, { fixatedTill: null }, { new: true })
      .then((entity) => {
        const inst = this.instantiateFrom(entity);
        if (!inst) throw new EntryNotFoundError(guid);
        return inst;
      });
  }
}

const CoreLinkSchema = extendSchema(
  BaseSchema,
  {
    guid: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    fixatedTill: { type: Date, required: false },
    text: { type: String, required: false },
    imageUrl: { type: String, required: false },
    secret: { type: String, required: false },
    reads: { type: Number, required: false },
    writes: { type: Number, required: false },
  },
  {
    timestamps: true,
    // collection: 'kudosentities',corelinkentities
  }
);
