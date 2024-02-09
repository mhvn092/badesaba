import {
  CreateOrderDto,
  FinishOrderDto,
  PaymentGatewayResultDto,
} from '@lib/accounting';
import {
  OrderEntity,
  OrderRepository,
  PaymentEntity,
} from '@lib/accounting/entities';
import {
  OrderDto,
  PaginationDto,
  UpdateResultModel,
  objectId,
} from '@lib/shared';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  OrderStatusEnum,
  PaymentStatusEnum,
} from 'libs/accounting/src/lib/enums';
import { MongoEntityManager } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: MongoEntityManager,
    private readonly _orderRepository: OrderRepository,
    private readonly _cartService: CartService,
    private readonly _paymentService: PaymentService
  ) {}

  findAllFilterd(
    pagination: PaginationDto,
    order: OrderDto,
    conditions: Partial<Record<keyof OrderEntity, any>>
  ): Promise<[OrderEntity[], number]> {
    return this._orderRepository.getAllWithPaginated(
      pagination,
      order,
      conditions
    );
  }

  async finishOrder(
    id: objectId,
    { deliveryTrackingCode }: FinishOrderDto
  ): Promise<UpdateResultModel> {
    const order = await this._orderRepository.getOneOrFail(id);

    if (order.status === OrderStatusEnum.Delivered) {
      throw new BadRequestException('order is already complete');
    }

    if (
      order.status === OrderStatusEnum.WaitingForPayment ||
      !order.isPaymentCleared
    ) {
      throw new BadRequestException('order is not paid');
    }

    return this._orderRepository
      .update(id, { deliveryTrackingCode, status: OrderStatusEnum.Delivered })
      .then((res) => ({ status: !!res.affected }));
  }

  async CheckOut(
    cartId: objectId,
    userId: objectId,
    { userAddress }: CreateOrderDto
  ): Promise<PaymentGatewayResultDto> {
    const [cart, orderItems] = await this._cartService.validateCart(
      cartId,
      userId
    );

    const totalPrice = orderItems.reduce((acc, item) => item.price + acc, 0);
    const orderInstance = this._orderRepository.create({
      cartId,
      status: OrderStatusEnum.WaitingForPayment,
      userId,
      totalItems: orderItems.length + 1,
      userAddress,
      totalPrice,
      isPaymentCleared: false,
      reductionDone: false,
    });

    orderInstance.items = orderItems;

    /*
    * really crappy way to do transactions in mongo with typeorm
    @see https://github.com/typeorm/typeorm/issues/3051
    */
    const session =
      this.entityManager.mongoQueryRunner.databaseConnection.startSession();

    session.startTransaction();
    let paymentId;

    try {
      const order = await this._orderRepository.insertOne(orderInstance, {
        session,
      });
      await this._cartService.deActiveCart(cartId, session);
      const paymentInstance: Partial<PaymentEntity> = {
        price: totalPrice,
        status: PaymentStatusEnum.Created,
        userId,
        orderId: order.insertedId,
        isCleared: false
      };
      paymentId = await this._paymentService.insertPayment(
        paymentInstance,
        session
      );

      await this._orderRepository.updateOne(
        order.insertedId,
        { paymentId },
        { session }
      );

      await session.commitTransaction();
    } catch (e) {
      console.error('error in transaction happend',e)
      await session.abortTransaction();

      throw new InternalServerErrorException('could not create payment');
    } finally {
      await session.endSession();
    }

    return this._paymentService.initializeGateway(
      paymentId,
      totalPrice,
      'ئرداخت سفارش'
    );
  }
}
