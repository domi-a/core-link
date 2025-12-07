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

  async get(guid: string, incrementRead?: boolean): Promise<CoreLinkEntity> {
    const findOrUpdate = !incrementRead
      ? this.entityModel.findOne({ guid })
      : this.entityModel.findOneAndUpdate(
          { guid },
          { $inc: { reads: 1 } },
          { new: true }
        );
    return findOrUpdate.then((entity) => {
      const inst = this.instantiateFrom(entity);
      if (!inst) throw new EntryNotFoundError(guid);
      else return inst;
    });
  }

  async getMulti(guids: string[]): Promise<CoreLinkEntity[]> {
    const query = { guid: { $in: guids } };
    return this.entityModel
      .find(query)
      .then((entities) => {
        return entities.map((e) => this.instantiateFrom(e));
      })
      .then((entitys) => {
        return entitys.filter((e) => e !== null);
      });
  }

  async updateMulti(
    guids: string[],
    params: Partial<CoreLinkEntity>
  ): Promise<number> {
    const query = { guid: { $in: guids } };
    return this.entityModel.updateMany(query, params).then((entities) => {
      return entities.modifiedCount;
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
