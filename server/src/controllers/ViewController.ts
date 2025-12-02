/** @format */
import { Express, NextFunction, Request, Response } from 'express';
import { config } from '../config/config';
import { iocContainer } from '../config/ioc';
import { PathFoundError } from '../middlewares/errorHandler';
import { CoreLinkEntity } from '../persistance/models/coreLinkEntity';
import { CoreLinkService } from '../services/coreLinkService';

export class ViewController {
  constructor(protected app: Express) {
    const service = iocContainer.get<CoreLinkService>(CoreLinkService);

    app.get('/', (_, res: Response) => {
      res.render('home', enrichViewData({}));
    });

    app.get('/create-instructions', (_, res: Response) => {
      res.render('create-instructions', enrichViewData({}));
    });

    app.get('/create', (_, res: Response, next: NextFunction) => {
      res.render('create', enrichViewData({}));
    });

    app.post('/create', (req: Request, res: Response, next: NextFunction) => {
      service
        .create(req.body)
        .then((data) => {
          res.cookie(data.guid, data.secret, {
            expires: data.fixatedTill,
          });
          res.render('view', enrichViewData(data));
        })
        .catch(next);
    });

    app.get('/create-blank', (_, res: Response, next: NextFunction) => {
      service
        .createDefault()
        .then((data) => {
          res.render('view', enrichViewData(data));
        })
        .catch(next);
    });

    app.get(
      '/view/:guid',
      (req: Request, res: Response, next: NextFunction) => {
        const guid = req.params['guid'];
        service
          .get(guid, getCookie(req, guid), false, true)
          .then((data) => {
            res.render('view', enrichViewData(data));
          })
          .catch(next);
      }
    );

    app.get(
      '/view/:guid/unlock',
      (req: Request, res: Response, next: NextFunction) => {
        const guid = req.params['guid'];
        service
          .unlock(guid, undefined, true)
          .then((data) => {
            res.redirect(`/view/${guid}`);
          })
          .catch(next);
      }
    );

    app.get(
      '/unlock/:guid',
      (req: Request, res: Response, next: NextFunction) => {
        const guid = req.params['guid'];
        service
          .unlock(guid, getCookie(req, guid))
          .then((data) => {
            res.render('view', enrichViewData(data));
          })
          .catch(next);
      }
    );

    app.get(
      '/edit/:guid',
      (req: Request, res: Response, next: NextFunction) => {
        const guid = req.params['guid'];
        service
          .get(guid, getCookie(req, guid), true, false)
          .then((data) => {
            res.render('edit', enrichViewData(data));
          })
          .catch(next);
      }
    );

    app.post(
      '/update/:guid',
      (req: Request, res: Response, next: NextFunction) => {
        const guid = req.params['guid'];
        service
          .update(guid, req.body, getCookie(req, guid))
          .then((data) => {
            res.cookie(data.guid, data.secret, {
              expires: data.fixatedTill,
            });
            res.render('view', {
              ...enrichViewData(data),
              unlockAllowed: true,
            });
          })
          .catch(next);
      }
    );

    // app.use('/docs', swaggerUi.serve, async (req: Request, res: Response) => {
    //   res.send(swaggerUi.generateHTML(apiDef));
    // });

    app.use((req: Request, res: Response, next: NextFunction) => {
      throw new PathFoundError(req.path);
    });
  }
}

export function getCookie(req: Request, name: string) {
  const cook = req.headers.cookie?.split('; ');
  const cookies = new Map();
  if (cook) {
    cook.forEach((c) => {
      const aa = c.split('=');
      cookies.set(aa[0], aa[1]);
    });
    return cookies.get(name);
  } else return undefined;
}

export function enrichViewData<T>(datas: ViewInput): ViewOutput {
  const additionalData: GlobalExtra = { appTitle: config.appTitle };
  return { data: { ...datas, ...additionalData } };
}
interface GlobalExtra {
  appTitle: string;
}
interface UnknownData {
  [key: string]: Object | null | undefined;
}
type ViewInput = Partial<CoreLinkEntity> | Partial<UnknownData>;
type ViewOutput = { data: GlobalExtra & ViewInput };
