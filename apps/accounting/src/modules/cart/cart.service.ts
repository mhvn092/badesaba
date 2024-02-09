import {
  CartItemResponseDto,
  CreateCartItemDto,
  UpdateCartItemDto,
} from '@lib/accounting';
import {
  CartEntity,
  CartItemEntity,
  CartItemRepository,
  CartRepository,
  OrderItemEntity
} from '@lib/accounting/entities';
import { UpdateResultModel, objectId, responseWrapper } from '@lib/shared';
import { ProductClientService } from '@lib/shared/modules/product-client/services/product-client.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
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
      userId: { $eq: new ObjectId(userId) },
      isActive: { $eq: true },
    });
  }

  async getAllCartItems(userId: objectId): Promise<CartItemResponseDto[]> {
    const cart = await this.getActiveCart(userId);

    if (!cart) return [];

    const cartItems = await this._cartItemRepository.getByCartId(
      cart._id,
      userId
    ).then(res => responseWrapper(CartItemEntity,res))
    if (!cartItems?.length) return [];

    // since the front wants to show the data to the user

    try {
      const { response } = await this._productClientService.GetAvailability({
        bookIds: cartItems.map((item) => item.bookId?.toString()),
      });

      if (!response?.length)
        return cartItems.map((item) => ({
          ...item,
          name: '',
          availability: 0,
          price: 0,
        }));

      return cartItems.map((item) => {
        const book = response.find((res) => res.bookId === item.bookId?.toString());
        return {
          ...item,
          availability: book?.availability || 0,
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
      const { response } = await this._productClientService.GetAvailability({
        bookIds: cartItems.map((item) => item.bookId.toString()),
      });
      if (!response?.length || response?.length !== cartItems?.length) {
        throw new BadRequestException('some of the items are not valid');
      }

      const responses: Partial<OrderItemEntity[]> = [];

      if (
        !cartItems.every((item) => {
          const book = response.find((res) => res.bookId === item.bookId?.toString());
          if (!book) {
            return false;
          }
          if (book.availability - item.quantity < 0) {
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
  ): Promise<CartItemEntity> {
    let activeCart = await this.getActiveCart(userId);
    if (activeCart) {
      const isDuplicate = await this._cartItemRepository.findOneBy({
        userId: { $eq: new ObjectId(userId) },
        cartId: { $eq: activeCart._id },
        bookId: { $eq: new ObjectId(bookId) },
      });
      if (isDuplicate) {
        throw new BadRequestException('the item is already in your cart');
      }
    }

    await this._checkAvailability(bookId, quantity);

    if (!activeCart) {
      activeCart = await this._cartRepository.save({
        userId: new ObjectId(userId),
        isActive: true,
      });
    }

    return this._cartItemRepository
      .save({
        cartId: activeCart._id,
        userId: new ObjectId(userId),
        bookId: new ObjectId(bookId),
        quantity,
        isActive: true,
      })
      .then((res) => responseWrapper(CartItemEntity, res));
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
    await this._cartRepository.update(new ObjectId(cartId),
      { isActive: false },
      // { session }
    );

    await this._cartItemRepository.update(
      { cartId: new ObjectId(cartId)  },
      { isActive: false },
      // { session }
    );
  }

  private async _checkAvailability(bookId: objectId, quantity: number) {
    let res;
    try {
      const { response } = await this._productClientService.GetAvailability({
        bookIds: [bookId?.toString()],
      });
      res = response;
      if (!res?.length) {
        throw new BadRequestException('item is not available');
      }
    } catch (e) {
      console.error('error in retrivien', e);
      throw new InternalServerErrorException(e);
    }

    if (res[0].availability - quantity < 0) {
      throw new BadRequestException('not enough in the store');
    }
  }
}
