/** @format */

import { config } from '../config/config';
import { iocContainer } from '../config/ioc';
import { RightsError } from '../middlewares/errorHandler';
import { CoreLinkRepository } from '../persistance/coreLinkRepo';
import { CoreLinkEntity } from '../persistance/models/coreLinkEntity';

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
        return getReadData(d, secret);
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
          ...getAdditionalWriteData(params),
          reads: 0,
          writes: 0,
        })
      )
      .then((d) => {
        return {
          ...getReadData(d),
          ...getViewUrl(d.guid),
          unlockAllowed: true,
        };
      });
  }

  public createDefault() {
    return this.create({ ...config.defaultEntry, fixateForDays: '0' });
  }

  public update(guid: string, params: CoreLinkUpdate, secret: string) {
    return this.get(guid, secret, true, false).then(() => {
      return this.repo
        .patch(guid, {
          ...params,
          ...getAdditionalWriteData(params),
          secret: crypto.randomUUID(), //use new new secret on update
        })
        .then((d) => {
          return { ...getReadData(d, secret), unlockAllowed: true };
        });
    });
  }

  public unlock(guid: string, secret: string | undefined, force?: boolean) {
    if (force) {
      return this.repo.unlock(guid);
    } else {
      return this.repo.get(guid).then((d) => {
        if (unlockAllowed(d, secret)) {
          return this.repo.unlock(guid);
        } else {
          throw new RightsError(guid);
        }
      });
    }
  }
}

function getDate(days: number | undefined): Date | undefined {
  if (!days) return undefined;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

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
function getReadData(data: CoreLinkEntity, secret?: string) {
  const fixatedTillStr = new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data.fixatedTill);
  return {
    ...data,
    locked: isLocked(data),
    unlockAllowed: unlockAllowed(data, secret),
    fixatedTillStr,
  };
}
function getAdditionalWriteData(params: CoreLinkCreate) {
  return {
    fixatedTill: getDate(
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

function getViewUrl(guid: string) {
  return { url: `${config.viewHost}/view/${guid}` };
}
