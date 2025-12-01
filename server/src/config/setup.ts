/** @format */

import { TenorController } from '../controllers/tenorController';
import { iocContainer } from '../ioc';
import { CoreLinkRepository } from '../persistance/coreLinkRepo';
import { CoreLinkService } from '../services/coreLinkService';
import { TenorService } from '../services/tenorService';

export function registerIocDependencies() {
  [CoreLinkRepository, CoreLinkService, TenorService, TenorController].forEach(
    (item) => {
      try {
        iocContainer.register(item, () => {
          return new item();
        });
      } catch (e) {
        console.error('eror ios setup', e);
      }
    }
  );
}
