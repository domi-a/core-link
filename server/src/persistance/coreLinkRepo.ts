/** @format */

import { MongooseRepository } from 'monguito';
import { EntryNotFoundError } from '../middlewares/errorHandler';
import { CoreLinkUpdate } from '../services/coreLinkService';
import { CoreLinkEntity, CoreLinkSchema } from './models/coreLinkEntity';

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
