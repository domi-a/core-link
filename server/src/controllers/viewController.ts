/** @format */
import { Express, NextFunction, Request, Response } from 'express';
import { version } from '../../package.json';
import { config } from '../config/config';
import { iocContainer } from '../config/ioc';
import { PathFoundError, ViewError } from '../middlewares/errorHandler';
import {
  blankPlaceHolder,
  CoreLinkEntity,
} from '../persistance/models/coreLinkEntity';
import { CoreLinkService } from '../services/coreLinkService';
import { convertSpecialStrings, toGerDateStr } from '../utils';

export class ViewController {
  constructor(protected app: Express) {
    const service = iocContainer.get<CoreLinkService>(CoreLinkService);

    app.get('/', (_, res: Response) => {
      res.render('home', enrichViewData());
    });

    app.get('/create-instructions', (_, res: Response) => {
      res.render('create-instructions', enrichViewData());
    });

    app.get('/create', (_, res: Response, next: NextFunction) => {
      res.render('create', enrichViewData());
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
            res.render('edit', enrichViewData(data, true));
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
      if (req.path !== '/.well-known/appspecific/com.chrome.devtools.json') {
        throw new PathFoundError(req.path);
      }
    });
  }
}

export function getCookie(req: Request, name: string) {
  const cook = req.headers.cookie?.split('; ');
  const cookies = new Map();
  if (cook) {
    cook.forEach((c) => {
      const [key, value] = c.split('=');
      cookies.set(key, value);
    });
    return cookies.get(name);
  } else return undefined;
}

export function enrichViewData(
  data?: CoreLinkEntity | ViewError,
  removeExampleContent = false
): {
  data: ViewData;
} {
  const additionalData = { appTitle: config.appTitle, version };
  if (data && 'error' in data) {
    return { data: { ...data, ...additionalData } };
  }
  if (data && 'guid' in data) {
    if (
      data.from === blankPlaceHolder &&
      data.to === blankPlaceHolder &&
      data.text
    ) {
      if (!removeExampleContent) {
        //add data for blank enry
        const dateTxt =
          'created: ' + toGerDateStr(new Date(data.text), true) + '\r\n';
        data = {
          ...data,
          ...config.defaultEntry,
          text: config.defaultEntry.text + dateTxt,
        };
      } else {
        //remove blank entry data
        data = {
          ...data,
          from: '',
          to: '',
          text: '',
          imageUrl: '',
        };
      }
    }
    return {
      data: {
        ...data,
        ...additionalData,
        textEnriched: convertSpecialStrings(data?.text),
      },
    };
  } else {
    return { data: additionalData };
  }
}

interface ViewData extends Partial<CoreLinkEntity>, Partial<ViewError> {
  textEnriched?: string;
  appTitle: string;
  version: string;
}
