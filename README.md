<h1 align="center"></h1>

<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="150" alt="Nest Logo" />
  </a>
</div>

<h3 align="center">A module for Utilizing Knex.js with NestJS</h3>
<h4 align="center">Generated by @nestjsplus/dyn-schematics</h4>

<div align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-red.svg" alt="Built with NestJS">
  </a>
  <img src="https://badge.fury.io/js/%40nestjsplus%2Fknex.svg" alt="npm version" height="18">
  <a href="https://github.com/nestjsplus/dyn-schematics">
    <img src="https://img.shields.io/badge/Built%20with-%40nestjsplus%2Fdyn--schematics-brightgreen" alt="Built with @nestjsplus/dyn-schematics">
  </a>
</div>

### About

This module provides a thin wrapper around [Knex.js](http://knexjs.org).  Knex.js is primarily a *Query Builder* that works with multiple databases.

The module was generated using [@nestjsplus/dyn-schematics](https://github.com/nestjsplus/dyn-schematics), a schematics package for NestJS that generates *dynamic modules* using the pattern [described here](https://dev.to/nestjs/advanced-nestjs-how-to-build-completely-dynamic-nestjs-modules-1370). There's a complete tutorial on [using the custom schematics here](https://dev.to/nestjs/build-a-nestjs-module-for-knex-js-or-other-resource-based-libraries-in-5-minutes-12an).

### Installation

```bash
npm install @nestjsplus/knex
```

(or yarn equivalent)

### Quick Start

To configure your DB connection, import the `KnexModule` module using the familiar `register()` / `registerAsync()` pattern. See the [example repo](https://github.com/nestjsplus/knex-cats) for an example. Basically, you configure the module with a Knex.js `connection` object, which maps directly to the connection options [in the Knex.js docs](http://knexjs.org/#Installation-client).

Once configured, inject the `SINGLETON` knex api interface object into any service using the `KNEX_CONNECTION` injection token.

For example, your `AppModule` might look like this (full example in the [sample repo](https://github.com/nestjsplus/knex-cats)):

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { KnexModule } from '@nestjsplus/knex';

@Module({
  imports: [
    KnexModule.registerAsync({
      useExisting: ConfigService,
    }),
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Now you have access to a `KNEX_CONNECTION` token that is associated with the Knex.js API, which you can inject into any provider, and use the resulting Knex.js API object directly. For example, you might do this:

```typescript
// src/app.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from '@nestjsplus/knex';

@Injectable()
export class AppService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex) {}

  async getCats() {
    return await this.knex('cats')
      .select('*')
      .from('cats');
  }
  ...
```

Here, you've injected the connection as a local property of the service class, and can access any of the Knex.js API through that property (e.g., `return await this.knex('cats').select('*').from('cats')`, where `knex` represents your Knex.js API object).

### Configuring connection options

I'm not showing the `ConfigService` in the `AppModule` above, but it's just an _injectable_ that implements the `KnexOptionsFactory` interface, meaning it has methods to return a `KnexOptions` object. A `KnexOptions` object looks like:

```json
{
  client: 'pg',
  debug: true,
  connection: {
    host: 'localhost',
    user: 'john',
    password: 'password',
    database: 'nest',
    port: 5432,
  },
}
```

You can use any of the following methods to provide the `KnexOptions` to the module. These follow the [usual patterns for custom providers](https://docs.nestjs.com/fundamentals/custom-providers):

- `register()`: pass a plain JavaScript object
- `registerAsync()`: pass a dynamic object via:
  - `useFactory`: supply a factory function to return the object; the factory should implement the appropriate [options factory](https://github.com/nestjsplus/knex/blob/master/src/interfaces/knex-options-factory.interface.ts) interface
  - `useClass`: bind to a provider/service that supplies the object; that service should implement the appropriate [options factory](https://github.com/nestjsplus/knex/blob/master/src/interfaces/knex-options-factory.interface.ts) interface
  - `useExisting`: bind to an existing (provided elsewhere) provider/service to supply the object; that service should implement the appropriate [options factory](https://github.com/nestjsplus/knex/blob/master/src/interfaces/knex-options-factory.interface.ts) interface

### Connection availability on application startup

The `KNEX_CONNECTION` is an [asynchronous provider](https://docs.nestjs.com/fundamentals/async-providers). This means that the Nest application bootstrap process (specifically, the Dependency Injection phase) won't complete until the DB connection is made. So your app, once it bootstraps, is guaranteed to have a DB connection via the `KNEX_CONNECTION` injection token. Note that asynchronous providers must be injected with the `@Inject()` decorator instead of normal constructor injection (again, see the [example](https://github.com/nestjsplus/knex-cats)).

### Working Example

See [knex-cats](https://github.com/nestjsplus/knex-cats) for a full example. It shows an example of using the `KNEX_CONNECTION`, a service that uses it to access a PostgreSQL database, and includes a few of the Knex.js Query Builder features.

### About @nestjsplus/dyn-schematics

[Nest Dynamic Package Generator Schematics](https://github.com/nestjsplus/dyn-schematics) generates a starter template for building NestJS dynamic packages.  It uses the `@nestjs/cli` core package, and provides customized schematics for generating modular NestJS applications.  See [here](https://github.com/nestjsplus/dyn-schematics) for the full set of available schematics, and documentation.  Read these articles for more background:

- [Advanced NestJS: How to build completely dynamic NestJS modules](https://dev.to/nestjs/advanced-nestjs-how-to-build-completely-dynamic-nestjs-modules-1370) - covers the design pattern used by this module
- [Build a NestJS Module for Knex.js (or other resource-based libraries) in 5 Minutes](https://dev.to/nestjs/build-a-nestjs-module-for-knex-js-or-other-resource-based-libraries-in-5-minutes-12an) - covers a custom schematic that can be used to generate a module template based on this pattern

### Change Log

See [Changelog](CHANGELOG.md) for more information.

### Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

### Author

**John Biundo (Y Prospect on [Discord](https://discord.gg/G7Qnnhy))**

### License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
