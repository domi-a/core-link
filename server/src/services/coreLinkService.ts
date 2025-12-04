/** @format */

import { iocContainer } from '../config/ioc';
import { RightsError } from '../middlewares/errorHandler';
import { CoreLinkRepository } from '../persistance/coreLinkRepo';
import { CoreLinkEntity } from '../persistance/models/coreLinkEntity';
import { getDateInDays, getViewUrl, toGerDateStr } from '../utils';
export class CoreLinkService {
  repo: CoreLinkRepository =
    iocContainer.get<CoreLinkRepository>(CoreLinkRepository);
  public get(
    id: string,
    secret: string,
    rightsCheck: boolean,
    readIncrement: boolean
  ) {
    return this.repo
      .get(id, readIncrement)
      .then((d) => {
        return getEnrichedReadData(d, secret);
      })
      .then((d) => {
        if (!rightsCheck) {
          return d;
        }
        if (d.locked && !d.unlockAllowed) {
          throw new RightsError(d.guid);
        } else return d;
      });
  }

  public create(params: CoreLinkCreate) {
    return this.repo
      .save(
        new CoreLinkEntity({
          ...params,
          guid: crypto.randomUUID(),
          secret: crypto.randomUUID(),
          ...getEnrichedWriteData(params),
          reads: 0,
          writes: 0,
        })
      )
      .then((d) => {
        return {
          ...getEnrichedReadData(d),
          ...getViewUrl(d.guid),
          unlockAllowed: true,
        };
      });
  }

  public createDefault() {
    return this.create({
      from: blankPlaceHolder,
      to: blankPlaceHolder,
      text: new Date().toString(),
      imageUrl: null,
      fixateForDays: '0',
    });
  }

  public update(guid: string, params: CoreLinkUpdate, secret: string) {
    return this.get(guid, secret, true, false).then(() => {
      return this.repo
        .patch(guid, {
          ...params,
          ...getEnrichedWriteData(params),
          secret: crypto.randomUUID(), //use new new secret on update
        })
        .then((d) => {
          return { ...getEnrichedReadData(d, secret), unlockAllowed: true };
        });
    });
  }

  public unlock(guid: string, secret: string | undefined, force?: boolean) {
    if (force) {
      return this.repo.unlock(guid).then(getEnrichedReadData);
    } else {
      return this.repo.get(guid).then((d) => {
        if (unlockAllowed(d, secret)) {
          return this.repo.unlock(guid).then(getEnrichedReadData);
        } else {
          throw new RightsError(guid);
        }
      });
    }
  }
}
export const blankPlaceHolder = '*';
function isLocked(data: CoreLinkEntity | null) {
  if (!data) return;
  if (!data.fixatedTill) return false;
  const now = new Date();
  return now < data.fixatedTill;
}

function unlockAllowed(
  data: CoreLinkEntity | null,
  browserSecret?: string
): boolean {
  if (!data) {
    return false;
  }
  if (!data.fixatedTill) {
    return true;
  }
  return browserSecret ? browserSecret === data.secret : false;
}

function getEnrichedReadData(data: CoreLinkEntity, secret?: string) {
  return {
    ...data,
    locked: isLocked(data),
    unlockAllowed: unlockAllowed(data, secret),
    fixatedTillStr: toGerDateStr(data.fixatedTill),
  };
}

function getEnrichedWriteData(params: CoreLinkCreate) {
  return {
    fixatedTill: getDateInDays(
      params.fixateForDays ? Number(params.fixateForDays) : undefined
    ),
    imageUrl:
      params.imageUrl && params.imageUrl.length > 0 ? params.imageUrl : null,
  };
}

export interface CoreLinkUpdate
  extends Omit<
    CoreLinkEntity,
    'id' | 'fixatedTill' | 'guid' | 'reads' | 'writes'
  > {
  fixateForDays: string;
  imageUrl: string | null;
}

export interface CoreLinkCreate extends Omit<CoreLinkUpdate, 'secret'> {}
