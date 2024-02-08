import { SharedTypeOrmModule } from '@lib/shared';
import { appConfig } from '@lib/shared/config/app.config';
import { corsConfig } from '@lib/shared/config/cors.config';
import { AuthClientModule } from '@lib/shared/modules/auth-client';
import { ProductClientModule } from '@lib/shared/modules/product-client';
import { typeormConfig } from '@lib/shared/modules/shared-typeorm/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from '../../modules/order/order.module';
import { CartModule } from '../../modules/cart/cart.module';
import { PaymentModule } from '../../modules/payment/payment.module';

export const ACCOUNTING_MODULES = [
  AuthClientModule,
  OrderModule,
  CartModule,
  PaymentModule,
  ConfigModule.forFeature(appConfig),
  ConfigModule.forFeature(typeormConfig),
  ConfigModule.forFeature(corsConfig),
  SharedTypeOrmModule.forRoot(),
];
