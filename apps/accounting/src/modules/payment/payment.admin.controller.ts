import {
  GetWithPaginationInfo, ModulesEnum, OrderDto,
  Paginate,
  PaginationDto,
  QueryOrder,
  QueryPagination,
  RouteTypeEnum, SharedControllerInfo
} from '@lib/shared';
import { PaymentService } from './payment.service';
import { PaymentEntity } from '@lib/accounting/entities';

@SharedControllerInfo(ModulesEnum.Payment, 'payment', RouteTypeEnum.ADMIN)
export class PaymentAdminController {
  constructor(private readonly _paymentsService: PaymentService) {}

  @GetWithPaginationInfo(
    'all',
    {
      description: 'this route returns all payments requested with optional filters',
      summary: 'get all payments',
    },
    PaymentEntity
  )
  async getAllWithPagination(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto,
  ): Promise<Paginate<PaymentEntity>> {
    const [payments, total] = await this._paymentsService.getAllWithPaginationForAdmin(
      pagination,
      order,
    );
    return new Paginate(payments, pagination.getPagination(total));
  }
}
