/** @format */

import { NextFunction, Request, Response } from 'express';
import { ValidationException } from 'monguito';
import { inHTMLData } from 'xss-filters';
import { config } from '../config/config';
import { enrichViewData } from '../controllers/viewController';
export class EntryNotFoundError extends Error {
  constructor(guid: string) {
    super(`entry not found ${guid}`);
  }
}
export class PathFoundError extends Error {
  constructor(path: string) {
    super(`path not found ${path}`);
  }
}
export class RightsError extends Error {
  constructor(guid: string) {
    super(`no rights ${guid}`);
  }
}
export interface AppError extends Error {
  status?: number;
  cause: { errors: Object };
  code?: string | Number;
  msg?: string;
  src?: string;
}

export function viewErrorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const message =
    config.stage === 'local'
      ? JSON.stringify(
          { message: err.message, errors: err.cause?.errors },
          null,
          2
        )
      : err.message;
  if (err instanceof EntryNotFoundError) {
    logViewError(req, '404');
    res.status(404);
    res.render('error', enrichViewData({ error: 404 }));
  } else if (err instanceof PathFoundError) {
    logViewError(req, '404');
    res.status(404);
    res.render('error', enrichViewData({ error: 404 }));
  } else if (err instanceof RightsError) {
    logViewError(req, '403');
    res.status(403);
    res.render('error', enrichViewData({ error: 403 }));
  } else if (err instanceof ValidationException) {
    logViewError(req, '400', message);
    res.status(400);
    res.render('error', enrichViewData({ error: 400, message }));
  } else if (Array.isArray(err.code) && err.code?.includes('PUG:')) {
    const internalErr = JSON.stringify({ ...err, filename: undefined });
    logViewError(req, 'pug', internalErr);
    res.status(500);
    res.render(
      'error',
      enrichViewData({
        error: 500,
        message: internalErr,
      })
    );
  } else if (err instanceof Error) {
    logViewError(req, '500', message);
    res.status(500);
    res.render('error', enrichViewData({ error: 500, message }));
  }
  next();
}
export function sanitizeBody(req: Request, res: Response, next: NextFunction) {
  const sanitBody = {} as any;
  if (!req.body) {
    next();
  } else {
    Object.entries(req.body).forEach(([key, value]) => {
      sanitBody[key] = inHTMLData(value as string);
    });
    req.body = sanitBody;
    next();
  }
  //    <script>console.log('!! danger zone !!')</script>
}
export function apiErrorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.xhr) {
    if (err instanceof EntryNotFoundError) {
      logApiError(req, '404', err.message);
      res.status(404).json({
        message: err.message,
      });
    } else if (err instanceof RightsError) {
      logApiError(req, '403', err.message);
      res.status(403).json({
        message: err.message,
      });
    } else if (err instanceof ValidationException) {
      logApiError(req, '422 validation', JSON.stringify(err?.message));
      res.status(422).json({
        message: 'Validation Failed',
        details: err?.message,
      });
    } else if (err instanceof Error) {
      logApiError(
        req,
        '500',
        JSON.stringify({ cause: err.cause, msg: err.msg })
      );
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  } else {
    next(err);
  }
}

function logViewError(req: Request, err: string, message?: string) {
  console.log('view error', req.path, err, message);
}

function logApiError(req: Request, err: string, message?: string | undefined) {
  console.log('api error', req.path, err, message);
}
