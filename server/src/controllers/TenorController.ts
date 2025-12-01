/** @format */

/** @format */

import { Controller, Get, Query, Route, SuccessResponse } from 'tsoa';
import { iocContainer } from '../ioc';
import { TenorService } from '../services/tenorService';

@Route('api/tenor')
export class TenorController extends Controller {
  service = iocContainer.get<TenorService>(TenorService);
  @SuccessResponse(200, 'OK')
  @Get('search')
  public async search(@Query() str: string, @Query() next?: string) {
    return this.service.get(str, next);
  }

}
