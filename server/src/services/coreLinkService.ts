/** @format */

import { version } from '../../package.json';
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
    return this.create({ ...config.defaultEntry, fixateForDays: '0' });
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

function getEnrichedReadData(data: CoreLinkEntity, secret?: string) {
  const fixatedTillStr = new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data.fixatedTill);
  return {
    ...data,
    locked: isLocked(data),
    unlockAllowed: unlockAllowed(data, secret),
    fixatedTillStr,
    textEnriched: convertSpecialStrings(data.text),
    version: version,
  };
}

function getEnrichedWriteData(params: CoreLinkCreate) {
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

function convertSpecialStrings(text: string) {
  text = convertUrls(text);
  text = convertSingleLineEmojis(text);
  text = convertFontStyle(text, '*', 'fw-bold', 'span');
  text = convertFontStyle(text, '_', '', 'em');
  text = convertFontStyle(text, '~', '', 's');
  return text;
}

function convertUrls(text: string) {
  const regex =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.(net|com|org|info|xyz|uk|de)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return text.replaceAll(regex, (url, args) => {
    if (url.startsWith('https://')) {
      return url.replace(
        url,
        `<a href="${url}" target="_blank">${url.replace('https://', '')}</a>`
      );
    } else if (url.startsWith('http://')) {
      return url.replace(
        url,
        `<a href="${url.replace('http:', 'https:')}" target="_blank">${url.replace('http://', '')}</a>`
      );
    } else {
      return url.replace(
        url,
        `<a href="https://${url}" target="_blank">${url}</a>`
      );
    }
  });
}

function convertSingleLineEmojis(text: string) {
  const regex =
    /(\n|\r|\r\n)\s*([\u2000-\u3300][\u2000-\uff00]|[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])\s*(\n|\r|\r\n)/gm;
  return text.replaceAll(regex, (found, args) => {
    return (
      '<p style="font-size:3rem;">' +
      found.replaceAll('\r', '').replaceAll('\n', '').replaceAll(' ', '') +
      '</p>'
    );
  });
}

function convertFontStyle(
  text: string,
  charToRep: string,
  addClass: string,
  tagSourround: string
) {
  const regex = new RegExp(`\\s\\${charToRep}([A-z])*\\${charToRep}\\s`, 'gim');
  return text.replaceAll(regex, (found, args) => {
    return ` <${tagSourround} class="${addClass}">${found.replace(found, found.replace(` ${charToRep}`, '').replace(`${charToRep} `, ''))}</${tagSourround}> `;
  });
}
