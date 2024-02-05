import { SharedTypeOrmModule } from '@lib/shared';
import { appConfig } from '@lib/shared/config/app.config';
import { corsConfig } from '@lib/shared/config/cors.config';
import { AuthClientModule } from '@lib/shared/modules/auth-client';
import { typeormConfig } from '@lib/shared/modules/shared-typeorm/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';

export const ACCOUNTING_MODULES = [
  AuthClientModule,
  ConfigModule.forFeature(appConfig),
  ConfigModule.forFeature(typeormConfig),
  ConfigModule.forFeature(corsConfig),
  SharedTypeOrmModule.forRoot(),
];
