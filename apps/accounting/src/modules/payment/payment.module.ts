import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentService } from './payment.service';
import { PaymentAdminController } from './payment.admin.controller';
import { PaymentCompanyController } from './payment.controller';
import { PaymentPublicController } from './payment.public.controller';
import { GatewayService } from './gateway.service';
import { OrderRepository, PaymentEntity, PaymentRepository } from '@lib/accounting/entities';
import { appConfig } from '@lib/shared';
import { ProductClientModule } from '@lib/shared/modules/product-client';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    ConfigModule.forFeature(appConfig),
    ProductClientModule
  ],
  controllers: [PaymentAdminController, PaymentCompanyController, PaymentPublicController],
  providers: [
    PaymentService,
    PaymentRepository,
    OrderRepository,
    GatewayService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
