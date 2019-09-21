import {
  KnexOptions,
} from './knex-options.interface';

export interface KnexOptionsFactory {
  createKnexOptions():
    | Promise<KnexOptions>
    | KnexOptions;
}
