import { ApiProperty } from '@nestjs/swagger';
import { CartItemEntity } from '../../database/entities/cart-item';

export class CartItemResponseDto extends CartItemEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  availability: number;

  @ApiProperty()
  price: number;
}
