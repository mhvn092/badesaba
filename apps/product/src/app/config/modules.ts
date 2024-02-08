import { SharedTypeOrmModule } from '@lib/shared';
import { appConfig } from '@lib/shared/config/app.config';
import { corsConfig } from '@lib/shared/config/cors.config';
import { grpcConfig } from '@lib/shared/config/grpc.config';
import { AuthClientModule } from '@lib/shared/modules/auth-client';
import { typeormConfig } from '@lib/shared/modules/shared-typeorm/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from '../../modules/category/category.module';
import { AuthorModule } from '../../modules/author/author.module';
import { BookModule } from '../../modules/book/book.module';


export const PROUDCT_MODULES = [
  CategoryModule,
  AuthorModule,
  BookModule,
  AuthClientModule,
  ConfigModule.forFeature(appConfig),
  ConfigModule.forFeature(typeormConfig),
  ConfigModule.forFeature(corsConfig),
  ConfigModule.forFeature(grpcConfig),
  SharedTypeOrmModule.forRoot(),
];
