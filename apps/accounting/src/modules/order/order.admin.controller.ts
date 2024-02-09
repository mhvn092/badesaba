import { OrderEntity } from '@lib/accounting/entities';
import {
  GetWithPaginationInfo,
  ModulesEnum,
  OrderDto,
  Paginate,
  PaginationDto,
  PutInfo,
  QueryOrder,
  QueryPagination,
  RouteTypeEnum,
  SharedControllerInfo,
  UpdateResultModel,
  objectId,
} from '@lib/shared';
import { OrderStatusEnum } from 'libs/accounting/src/lib/enums';
import { OrderService } from './order.service';
import { FinishOrderDto } from '@lib/accounting';
import { Body, Param } from '@nestjs/common';

@SharedControllerInfo(ModulesEnum.Order, 'order', RouteTypeEnum.ADMIN)
export class OrderAdminController {
  constructor(private readonly _orderService: OrderService) {}

  @GetWithPaginationInfo(
    'all',
    {
      description:
        'this route returns all payments requested with optional filters',
      summary: 'get all payments',
    },
    OrderEntity
  )
  async getAllWithPagination(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto
  ): Promise<Paginate<OrderEntity>> {
    const [payments, total] = await this._orderService.findAllFilterd(
      pagination,
      order,
      null
    );
    return new Paginate(payments, pagination.getPagination(total));
  }

  @GetWithPaginationInfo(
    'needs-action',
    {
      description:
        'this route returns all payments requested with optional filters',
      summary: 'get all payments',
    },
    OrderEntity
  )
  async getAllRequiredAction(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto
  ): Promise<Paginate<OrderEntity>> {
    const [payments, total] = await this._orderService.findAllFilterd(
      pagination,
      order,
      { status: { $eq: OrderStatusEnum.PaymentCompleted } }
    );
    return new Paginate(payments, pagination.getPagination(total));
  }

  @PutInfo('/finish/:id', ['id'], FinishOrderDto, false, {
    summary: 'update cart item quantity',
    outputType: UpdateResultModel,
  })
  update(
    @Param('id') id: objectId,
    @Body() data: FinishOrderDto
  ): Promise<UpdateResultModel> {
    return this._orderService.finishOrder(id, data);
  }
}
