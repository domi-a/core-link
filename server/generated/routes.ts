/**
 * tslint:disable
 *
 * @format
 */

/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { ExpressTemplateService, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { IocContainer, IocContainerFactory } from '@tsoa/runtime';
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from 'express';
import { GifSearchController } from '../src/controllers/gifSearchController';
import { iocContainer } from './../src/config/ioc';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: 'throw-on-extras',
  bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsGifSearchController_tenorSearch: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    str: { in: 'query', name: 'str', required: true, dataType: 'string' },
    next: { in: 'query', name: 'next', dataType: 'string' },
  };
  app.get(
    '/api/gifsearch/tenor',
    ...fetchMiddlewares<RequestHandler>(GifSearchController),
    ...fetchMiddlewares<RequestHandler>(
      GifSearchController.prototype.tenorSearch
    ),

    async function GifSearchController_tenorSearch(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGifSearchController_tenorSearch,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === 'function'
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<GifSearchController>(GifSearchController);
        if (typeof controller['setStatus'] === 'function') {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: 'tenorSearch',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsGifSearchController_klipySearch: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    str: { in: 'query', name: 'str', required: true, dataType: 'string' },
    next: { in: 'query', name: 'next', dataType: 'string' },
  };
  app.get(
    '/api/gifsearch/klipy',
    ...fetchMiddlewares<RequestHandler>(GifSearchController),
    ...fetchMiddlewares<RequestHandler>(
      GifSearchController.prototype.klipySearch
    ),

    async function GifSearchController_klipySearch(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGifSearchController_klipySearch,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === 'function'
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<GifSearchController>(GifSearchController);
        if (typeof controller['setStatus'] === 'function') {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: 'klipySearch',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
