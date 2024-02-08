import {
  CartItemResponseDto,
  CreateCartItemDto,
  UpdateCartItemDto,
} from '@lib/accounting';
import {
  CartEntity,
  CartItemRepository,
  CartRepository,
  OrderEntity,
  OrderItemEntity,
} from '@lib/accounting/entities';
import { UpdateResultModel, objectId } from '@lib/shared';
import { ProductClientService } from '@lib/shared/modules/product-client/services/product-client.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ClientSession } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    private readonly _cartRepository: CartRepository,
    private readonly _cartItemRepository: CartItemRepository,
    private readonly _productClientService: ProductClientService
  ) {}

  getActiveCart(userId: objectId) {
    return this._cartRepository.findOneBy({
      userId: { $eq: userId },
      isActive: { $eq: true },
    });
  }

  async getAllCartItems(userId: objectId): Promise<CartItemResponseDto[]> {
    const cart = await this.getActiveCart(userId);
    if (!cart) return [];

    const cartItems = await this._cartItemRepository.getByCartId(
      cart._id,
      userId
    );

    if (!cartItems?.length) return [];

    // since the front wants to show the data to the user

    try {
      const data = await this._productClientService.GetAvailability({
        bookIds: cartItems.map((item) => item._id.toString()),
      });

      if (!data?.length)
        return cartItems.map((item) => ({
          ...item,
          name: '',
          availability: 0,
          price: 0,
        }));

      return cartItems.map((item) => {
        const book = data.find((res) => res.bookId === item.bookId);
        return {
          ...item,
          availability: book?.avalability || 0,
          price: book?.price || 0,
          name: book?.name || '',
        };
      });
    } catch (e) {
      console.error('some unexpected error happend');
      return cartItems.map((item) => ({
        ...item,
        name: '',
        availability: 0,
        price: 0,
      }));
    }
  }

  async validateCart(
    cartId: objectId,
    userId: objectId
  ): Promise<[CartEntity, Partial<OrderItemEntity[]>]> {
    const cart = await this._cartRepository.getOneOrFail(cartId, userId);
    const cartItems = await this._cartItemRepository.getByCartId(
      cart._id,
      userId
    );

    if (!cartItems?.length) throw new BadRequestException('cart is empty');

    try {
      const data = await this._productClientService.GetAvailability({
        bookIds: cartItems.map((item) => item._id.toString()),
      });
      if (!data?.length || data?.length !== cartItems?.length) {
        throw new BadRequestException('some of the items are not valid');
      }

      const responses: Partial<OrderItemEntity[]> = [];

      if (
        !cartItems.every((item) => {
          const book = data.find((res) => res.bookId === item.bookId);
          if (!book) {
            return false;
          }
          if (book.avalability - item.quantity < 0) {
            return false;
          }
          responses.push({
            bookId: item.bookId,
            cartItemId: item._id,
            price: book.price,
            quantity: item.quantity,
          });
          return true;
        })
      ) {
        throw new BadRequestException('some of the books are not available');
      }

      return [cart, responses];
    } catch (e) {
      throw new InternalServerErrorException('Could not Retrive Item Data');
    }
  }

  async addItemToCart(
    userId: objectId,
    { bookId, quantity }: CreateCartItemDto
  ) {
    let activeCart = await this.getActiveCart(userId);
    if (activeCart) {
      const isDuplicate = await this._cartItemRepository.findOneBy({
        userId: { $eq: userId },
        cartId: { $eq: activeCart._id },
        bookId: { $eq: bookId },
      });
      if (isDuplicate) {
        throw new BadRequestException('the item is already in your cart');
      }
    }

    await this._checkAvailability(bookId, quantity);

    if (!activeCart) {
      activeCart = await this._cartRepository.save({ userId, isActive: true });
    }

    return this._cartItemRepository.save({
      cartId: activeCart._id,
      userId,
      bookId,
      quantity,
      isActive: true,
    });
  }

  async updateCartItem(
    id: objectId,
    userId: objectId,
    { quantity }: UpdateCartItemDto
  ): Promise<UpdateResultModel> {
    const cartItem = await this._cartItemRepository.getOneOrFail(id, userId);

    await this._checkAvailability(cartItem.bookId, quantity);

    return this._cartItemRepository
      .update(id, { quantity })
      .then((res) => ({ status: !!res.affected }));
  }

  async remove(id: objectId, userId: objectId) {
    await this._cartItemRepository.getOneOrFail(id, userId);

    return this._cartItemRepository.destroy(id);
  }

  async deActiveCart(cartId: objectId, session: ClientSession) {
    await this._cartRepository.updateOne(
      { _id: { $eq: new ObjectId(cartId) } },
      { isActive: false },
      { session }
    );

    await this._cartItemRepository.updateMany(
      { cartId: { $eq: new ObjectId(cartId) } },
      { isActive: false },
      { session }
    );
  }
  
  private async _checkAvailability(bookId: objectId, quantity: number) {
    try {
      const isAvailable = await this._productClientService.GetAvailability({
        bookIds: [bookId.toString()],
      });
      if (
        !isAvailable?.length ||
        (isAvailable?.length && isAvailable[0].avalability - quantity < 1)
      ) {
        throw new BadRequestException('item is not available');
      }
    } catch (e) {
      throw new InternalServerErrorException('Could not Retrive Item Data');
    }
  }
}
