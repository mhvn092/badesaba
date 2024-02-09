import {
  OrderEntity,
  OrderRepository
} from '@lib/accounting/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { PaymentModule } from '../payment/payment.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderAdminController } from './order.admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), CartModule, PaymentModule],
  controllers: [OrderController,OrderAdminController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
