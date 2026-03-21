/** @format */

/** @format */

import { Controller, Get, Query, Route, SuccessResponse } from 'tsoa';
import { iocContainer } from '../config/ioc';
import { KlipyService } from '../services/klipyService';

@Route('api/gifsearch')
export class GifSearchController extends Controller {
  klipyService = iocContainer.get<KlipyService>(KlipyService);
  @SuccessResponse(200, 'OK')
  @Get('klipy')
  public klipySearch(@Query() str: string, @Query() next?: string) {
    return this.klipyService.get(str, next);
  }
}
