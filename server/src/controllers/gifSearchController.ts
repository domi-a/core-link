/** @format */

/** @format */

import { Controller, Get, Query, Route, SuccessResponse } from 'tsoa';
import { iocContainer } from '../config/ioc';
import { KlipyService } from '../services/klipyService';
import { TenorService } from '../services/tenorService';

@Route('api/gifsearch')
export class GifSearchController extends Controller {
  tenorService = iocContainer.get<TenorService>(TenorService);
  @SuccessResponse(200, 'OK')
  @Get('tenor')
  public tenorSearch(@Query() str: string, @Query() next?: string) {
    return this.tenorService.get(str, next);
  }

  klipyService = iocContainer.get<KlipyService>(KlipyService);
  @SuccessResponse(200, 'OK')
  @Get('klipy')
  public klipySearch(@Query() str: string, @Query() next?: string) {
    return this.klipyService.get(str, next);
  }
}
