/** @format */

import { config } from './config/config';

/** @format */
export function toGerDateStr(date?: Date, seconds = false) {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'short',
      timeStyle: seconds ? 'medium' : 'short',
    }).format(date);
  } catch (e) {
    return 'unknown date';
  }
}
export function getViewUrl(guid: string) {
  return { url: `${config.viewHost}/view/${guid}` };
}
export function getDateInDays(days: number | undefined): Date | undefined {
  if (!days) return undefined;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function convertSpecialStrings(text: string | undefined) {
  if (!text) return '';
  text = convertUrls(text);
  text = convertSingleLineEmojis(text);
  text = convertFontStyle(text, '*', 'span', 'fw-bold');
  text = convertFontStyle(text, '_', 'em', '');
  text = convertFontStyle(text, '~', 's', '');
  return text;
}

function convertUrls(text: string) {
  const regex =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.(net|com|org|info|xyz|uk|de)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return text.replaceAll(regex, (url, args) => {
    const nonProtoUrl = url.replace('https://', '').replace('http://', '');
    return `<a href="https://${nonProtoUrl}" target="_blank">${nonProtoUrl}</a>`;
  });
}

function convertSingleLineEmojis(text: string) {
  const regex =
    /((?:\n|\r|\r\n)|^)\s*([\u2000-\u3300][\u2000-\uff00]|[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])\s*((?:\n|\r|\r\n)|$)/gm;
  return text.replaceAll(regex, (found) => {
    return (
      '<p style="font-size:3rem;">' +
      found.replaceAll('\r', '').replaceAll('\n', '').replaceAll(' ', '') +
      '</p>'
    );
  });
}

function convertFontStyle(
  text: string,
  escapeSeq: string,
  tag: string,
  addClass: string
) {
  const regex = new RegExp(`\\s\\${escapeSeq}([A-z])*\\${escapeSeq}\\s`, 'gim');
  return text.replaceAll(regex, (found, args) => {
    return ` <${tag} class="${addClass}">${found.replace(found, found.replace(` ${escapeSeq}`, '').replace(`${escapeSeq} `, ''))}</${tag}> `;
  });
}
