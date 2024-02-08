import {
  CartItemResponseDto,
  CreateCartItemDto,
  UpdateCartItemDto,
} from '@lib/accounting';
import { CartItemEntity } from '@lib/accounting/entities';
import {
  DeleteInfo,
  GetInfo,
  ModulesEnum,
  PostInfo,
  PutInfo,
  SharedControllerInfo,
  UpdateResultModel,
  User,
  UserAuthModel,
  objectId,
} from '@lib/shared';
import { Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@SharedControllerInfo(ModulesEnum.Cart, 'cart')
export class CartController {
  constructor(private readonly _cartService: CartService) {}

  @GetInfo('/all-items', null, {
    summary: 'get all the users cartItems',
    outputType: CartItemResponseDto,
    outputIsArray: true,
  })
  getAllItems(@User() user: UserAuthModel): Promise<CartItemResponseDto[]> {
    return this._cartService.getAllCartItems(user._id);
  }

  @PostInfo('/add-to-cart', CreateCartItemDto, false, {
    summary: 'add a item to cart',
    outputType: CartItemEntity,
  })
  addToCart(
    @User() user: UserAuthModel,
    @Body() data: CreateCartItemDto
  ): Promise<CartItemEntity> {
    return this._cartService.addItemToCart(user._id, data);
  }

  @PutInfo('/:id', ['id'], UpdateCartItemDto, false, {
    summary: 'update cart item quantity',
    outputType: UpdateResultModel,
  })
  update(
    @Param('id') id: objectId,
    @User() user: UserAuthModel,
    @Body() data: UpdateCartItemDto
  ): Promise<UpdateResultModel> {
    return this._cartService.updateCartItem(id, user._id, data);
  }

  @DeleteInfo(':id', ['id'], {
    summary: 'delete one CartItem',
    description: 'this route deletes one Cart Item',
  })
  remove(
    @Param('id') id: objectId,
    @User() user: UserAuthModel
  ): Promise<UpdateResultModel> {
    return this._cartService.remove(id, user._id);
  }
}
