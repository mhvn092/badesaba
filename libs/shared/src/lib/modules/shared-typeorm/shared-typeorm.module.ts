import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Module } from '@nestjs/common';

export class SharedTypeOrmModule {
  static forRoot() {
    return {
      module: SharedTypeOrmModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
        }),

        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forFeature(typeormConfig)],
          useFactory: (typeormConfigService: ConfigType<typeof typeormConfig>) => {
            return {
              type: 'mongodb',
              host: typeormConfigService.host,
              port: typeormConfigService.port,
              username: typeormConfigService.username,
              password: typeormConfigService.password,
              database: typeormConfigService.database,
              autoLoadEntities: true,
              synchronize: false,
              authSource: typeormConfigService.mongoAuthSource,
              logging: typeormConfigService.logging as any,
              logger:'simple-console',
            }
          },
          inject: [typeormConfig.KEY],
        }),
      ],
    };
  }
}
