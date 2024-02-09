import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Response } from 'express';
import {
  AppConfig,
  GatewayResultInterface,
  OrderDto,
  PaginationDto,
  UserAuthModel,
  appConfig,
  objectId,
} from '@lib/shared';
import {
  OrderRepository,
  PaymentEntity,
  PaymentRepository,
} from '@lib/accounting/entities';
import { VerifyPaymentDto } from '@lib/accounting';
import { ClientSession, MongoEntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  OrderStatusEnum,
  PaymentStatusEnum,
} from 'libs/accounting/src/lib/enums';
import { ObjectId } from 'mongodb';
import { ProductClientService } from '@lib/shared/modules/product-client/services/product-client.service';

@Injectable()
export class PaymentService {
  paymentInProgress: Record<string, boolean> = {};

  constructor(
    @InjectEntityManager()
    private readonly entityManager: MongoEntityManager,
    private readonly _paymentRepository: PaymentRepository,
    private readonly _gatewayService: GatewayService,
    private readonly _orderRepositroy: OrderRepository,
    private readonly _productClientService: ProductClientService,
    @Inject(appConfig.KEY)
    private readonly _appConfig: AppConfig
  ) {}

  async initializeGateway(
    paymentId: objectId,
    price: number,
    description: string
  ): Promise<GatewayResultInterface> {
    const backendServerRoute = this._appConfig.serverHost;
    return this._gatewayService.initialize(
      paymentId,
      'merchantId',
      price,
      description,
      `${backendServerRoute}/public/payment/verify/${paymentId}`
    );
  }

  getUserPayments(
    pagination: PaginationDto,
    order: OrderDto,
    user: UserAuthModel
  ): Promise<[PaymentEntity[], number]> {
    return this._paymentRepository.getUserPaymentsWithPagination(
      pagination,
      order,
      user._id
    );
  }

  getAllWithPaginationForAdmin(
    pagination: PaginationDto,
    order: OrderDto
  ): Promise<[PaymentEntity[], number]> {
    return this._getAllWithPagination(pagination, order);
  }

  async insertPayment(
    data: Partial<PaymentEntity>,
    session: ClientSession
  ): Promise<objectId> {
    const payment = await this._paymentRepository.save(
      data
      //    {
      //   session,
      // }
    );
    return payment._id;
  }

  public async payVerifyLogic(
    paymentId: objectId,
    authority: string,
    res: Response
  ) {
    console.debug({
      message: `Pay Verify Logic started for ${paymentId} with Authority : ${authority}`,
    });
    const result = await this.verifyPayment(paymentId, authority);
    console.debug({
      message: `Result received from accounting-service`,
      result,
    });
    let redirectParams;
    if (result.success) {
      redirectParams = new URLSearchParams({
        status: '1',
        paymentId: result.paymentId.toString(),
      });
    } else {
      redirectParams = new URLSearchParams({
        status: '0',
        message: result.message || result.error.message,
        paymentId: result.paymentId?.toString(),
      });
    }

    console.debug('Redirecting for web ...');
    /**
     * here we redirect the user to web page
     */
    return res.redirect(`${result.callback}?${redirectParams.toString()}`);
  }

  async verifyPayment(
    paymentId: objectId,
    authority: string
  ): Promise<VerifyPaymentDto> {
    let payment: PaymentEntity = await this._paymentRepository.getByAuthority(
      authority,
      paymentId
    );

    const clientHost = this._appConfig.clientHost + '/' + 'pay-verify';
    if (!payment) {
      return new VerifyPaymentDto({
        error: new BadRequestException('پرداخت یافت نشد'),
        callback: clientHost,
      });
    }

    if(payment.status === PaymentStatusEnum.Verified){
      return new VerifyPaymentDto({
        error: new BadRequestException('پرداخت قبلا تایید شده است '),
        callback: clientHost,
      });
    }
    try {
      payment = await this._gatewayService.verify(
        paymentId,
        payment.userId,
        authority,
        'merchantId'
      );

      if (!payment.trackingCode) {
        throw new BadRequestException('پرداخت یافت نشد');
      }

      await this.verify(payment);
    } catch (e) {
      return new VerifyPaymentDto({
        callback: clientHost,
        success: false,
        error: e,
        message: e.message,
        paymentId: payment._id,
      });
    }

    return new VerifyPaymentDto({
      callback: clientHost,
      success: true,
      trackingCode: payment.trackingCode,
      paymentId: payment._id,
    });
  }

  async verify(payment: PaymentEntity) {
    try {
      if (this.paymentInProgress[payment._id.toString()]) {
        throw new BadRequestException('پرداخت در حال تایید شدن است');
      }
      this.paymentInProgress[payment._id.toString()] = true;

      await this._verifyTransaction(payment);
    } catch (e) {
      throw new Error(e);
    } finally {
      delete this.paymentInProgress[payment._id.toString()];
    }
  }

  private async _verifyTransaction(payment: PaymentEntity) {
    // const session =
    //   this.entityManager.mongoQueryRunner.databaseConnection.startSession();

    // session.startTransaction();

    try {
      await this._orderRepositroy.update(
        { _id: new ObjectId(payment.orderId) },
        {
          status: OrderStatusEnum.PaymentCompleted,
          isPaymentCleared: true,
        }
        // {
        //   session,
        // }
      );

      await this._paymentRepository.update(
        payment._id,
        {
          status: PaymentStatusEnum.Verified,
          paidDate: new Date(),
          isCleared: true,
        }
        // { session }
      );

      // await session.commitTransaction();
    } catch (e) {
      // await session.abortTransaction();
      throw new InternalServerErrorException('could not verify payment');
    } finally {
      // await session.endSession();
    }
    const order = await this._orderRepositroy.getOneOrFail(payment.orderId);
    try {
      const result = await this._productClientService.ReduceAvailability({
        request: order.items.map((item) => ({
          bookId: item.bookId.toString(),
          quantity: item.quantity,
        })),
      });

      if (result.status) {
        await this._orderRepositroy.update(payment.orderId, {
          reductionDone: true,
        });
      }
    } catch (e) {
      console.log('an error in reducing availability happend');
      // i should write a cron to update the availibility
    }
    return { status: true };
  }

  private _getAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto
  ): Promise<[PaymentEntity[], number]> {
    return this._paymentRepository.getAllPaymentsWithPagination(
      pagination,
      order
    );
  }
}
