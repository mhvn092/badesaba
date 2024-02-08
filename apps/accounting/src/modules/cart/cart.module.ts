import {
  CartEntity,
  CartItemEntity,
  CartItemRepository,
  CartRepository,
} from '@lib/accounting/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductClientModule } from '@lib/shared/modules/product-client';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity]),ProductClientModule],
  controllers: [CartController],
  providers: [CartService, CartRepository, CartItemRepository],
  exports: [CartService],
})
export class CartModule {}
