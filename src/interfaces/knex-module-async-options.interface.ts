/* Dependencies */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/* Interfaces */
import { KnexOptions } from './knex-options.interface';
import { KnexOptionsFactory } from './knex-options-factory.interface';

export interface KnexAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<KnexOptionsFactory>;
  useClass?: Type<KnexOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<KnexOptions> | KnexOptions;
}
