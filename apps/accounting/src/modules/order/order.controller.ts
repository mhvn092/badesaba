import {
  CreateOrderDto,
  PaymentGatewayResultDto
} from '@lib/accounting';
import { CartItemEntity, OrderEntity } from '@lib/accounting/entities';
import {
  GetWithPaginationInfo,
  ModulesEnum,
  OrderDto,
  Paginate,
  PaginationDto,
  PostInfo,
  QueryOrder,
  QueryPagination,
  SharedControllerInfo,
  User,
  UserAuthModel,
  objectId
} from '@lib/shared';
import { Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@SharedControllerInfo(ModulesEnum.Order, 'order')
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  @GetWithPaginationInfo(
    'all',
    {
      description: 'this route returns all users order ',
      summary: 'get all users order',
    },
    OrderEntity
  )
  async findAll(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto,
    @User() user: UserAuthModel
  ): Promise<Paginate<OrderEntity>> {
    const [BookEntities, total] = await this._orderService.findAllFilterd(
      pagination,
      order,
      {
        userId: { $eq: user._id },
      }
    );

    return new Paginate(BookEntities, pagination.getPagination(total));
  }

  @PostInfo('/check-out/:cartId', CreateOrderDto, false, {
    summary: 'add a item to cart',
    outputType: CartItemEntity,
  },['cartId'])
  addToCart(
    @Param('cartId') cartId:objectId,
    @User() user: UserAuthModel,
    @Body() data: CreateOrderDto
  ): Promise<PaymentGatewayResultDto> {
    return this._orderService.CheckOut(cartId,user._id, data);
  }
}
