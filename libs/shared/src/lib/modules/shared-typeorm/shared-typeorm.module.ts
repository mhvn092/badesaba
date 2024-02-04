import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Module } from '@nestjs/common';

@Module({})
export class SharedTypeormModule {
  static forRoot(config: Pick<DataSourceOptions, 'entities' | 'migrations'>) {
    return {
      module: SharedTypeormModule,
      import: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
        }),
        ConfigModule.forFeature(typeormConfig),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forFeature(typeormConfig)],
          useFactory: (
            typeormConfigService: ConfigType<typeof typeormConfig>
          ) =>
            ({
              schema: 'public',
              type: typeormConfigService.connection as any,
              database: typeormConfigService.database,
              host: typeormConfigService.host,
              username: typeormConfigService.username,
              password: typeormConfigService.password,
              port: typeormConfigService.port,
              synchronize: true,
              autoLoadEntities: true,
              logging: 'all',
              migrations: config.migrations,
              entities: config.entities,
              migrationsTableName: 'migrations',
            } as DataSourceOptions),
          inject: [typeormConfig.KEY],
        }),
      ],
      providers: [DataSource],
    };
  }
}
