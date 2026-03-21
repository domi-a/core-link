/** @format */

import { FetchWrapper } from '../utils/FetchWrapper';
import { SearchService } from './SearchService';
export class TenorClient {
  public search: SearchService;

  constructor(
    apiKey: string,
    baseUrl = 'https://tenor.googleapis.com/v2',
    clientKey?: string
  ) {
    const fetchWrapper = new FetchWrapper(baseUrl, apiKey, clientKey);

    this.search = new SearchService(fetchWrapper);
  }
}
