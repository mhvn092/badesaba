import { PickType } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cart-item.dto';

export class UpdateCartItemDto extends PickType(CreateCartItemDto, [
  'quantity'
] as const) {}
