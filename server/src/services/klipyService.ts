/** @format */

import { config } from '../config/config';
import TenorClient from './tenor-gif-api';
import { SearchResponse } from './tenor-gif-api/api/SearchService';

const baseUrl = 'https://api.klipy.com/v2';
const defaultQueryParams = {
  limit: 32,
  media_filter: 'gif,nanogif,tinygif,mediumgif',
};

export class KlipyService {
  client = new TenorClient(config.klipyKey, baseUrl, 'corelink');
  public get(search: string, next?: string) {
    return this.client.search
      .query({
        q: search,
        pos: next,
        ...defaultQueryParams,
      })
      .then((result) => mapResults(result));
  }
}

function mapResults({ next, results }: SearchResponse) {
  const res = {
    next,
    list: results
      .map((resultItem) => {
        try {
          const [width, height] = resultItem.media_formats.nanogif.dims;
          const height2Width = width && height ? height / width : 0;
          return {
            id: resultItem.id,
            nanoUrl: resultItem.media_formats.nanogif.url,
            tinyUrl: resultItem.media_formats.tinygif.url,
            mediumUrl: resultItem.media_formats.mediumgif.url,
            url: resultItem.media_formats.gif.url,
            height2Width,
          };
        } catch (e) {
          console.error('error mapping tenor results');
          return undefined;
        }
      })
      .filter((i) => i !== undefined),
  };

  return res;
}
