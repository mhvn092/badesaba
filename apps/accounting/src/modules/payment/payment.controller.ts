import {
  GetWithPaginationInfo,
  ModulesEnum,
  OrderDto,
  Paginate,
  PaginationDto,
  QueryOrder,
  QueryPagination,
  SharedControllerInfo,
  User,
  UserAuthModel
} from '@lib/shared';
import { PaymentService } from './payment.service';
import { PaymentEntity } from '@lib/accounting/entities';

@SharedControllerInfo(ModulesEnum.Payment, 'payment')
export class PaymentCompanyController {
  constructor(private readonly _paymentsService: PaymentService) {}

  @GetWithPaginationInfo(
    'all',
    {
      description: 'this route returns all ad-contracts that belongs to the company',
      summary: 'get all ad-contracts that belongs to the company',
    },
    PaymentEntity,
    null,
    null,
  )
  async getPayments(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto,
    @User() user: UserAuthModel,
  ): Promise<Paginate<PaymentEntity>> {
    const [payments, total] = await this._paymentsService.getUserPayments(
      pagination,
      order,
      user,
    );
    return new Paginate(payments, pagination.getPagination(total));
  }
}
