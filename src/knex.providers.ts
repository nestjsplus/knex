import { KnexOptions } from './interfaces';

import { KNEX_OPTIONS } from './constants';

export function createKnexProviders(
  options: KnexOptions,
) {
  return [
    {
      provide: KNEX_OPTIONS,
      useValue: options,
    },
  ];
}
