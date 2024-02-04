import { SharedTypeOrmModule } from '@lib/shared';
import { appConfig } from '@lib/shared/config/app.config';
import { corsConfig } from '@lib/shared/config/cors.config';
import { typeormConfig } from '@lib/shared/modules/shared-typeorm/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../modules/person/auth/auth.module';
import { PersonModule } from '../../modules/person/person.module';

export const AUTH_MODULES = [
  PersonModule,
  AuthModule,
  ConfigModule.forFeature(appConfig),
  ConfigModule.forFeature(typeormConfig),
  ConfigModule.forFeature(corsConfig),
  SharedTypeOrmModule.forRoot(),
];
