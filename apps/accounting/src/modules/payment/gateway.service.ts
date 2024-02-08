import { PaymentEntity, PaymentRepository } from '@lib/accounting/entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  GatewayResultInterface,
  objectId,
  randomHex,
  randomNumber,
} from '@lib/shared';

@Injectable()
export class GatewayService {
  constructor(private readonly _paymentRepository: PaymentRepository) {}

  getError(code) {
    return 'پرداخت با مشکل مواجه شد';
  }

  getPaymentLink(authority) {
    return this.getLinks().payment + authority;
  }

  async initialize(
    paymentId: objectId,
    MerchantID: string,
    Amount: number,
    Description: string,
    CallbackURL: string
  ): Promise<GatewayResultInterface> {
    const data = {
      MerchantID,
      Amount,
      CallbackURL,
      Description,
      Email: '',
      Mobile: '',
    };

    const response = await this.sendRequest(
      this.getLinks().url + 'PaymentRequest.json',
      data
    );

    if (response.Status !== 100) {
      throw new BadRequestException(this.getError(response.Status));
    }
    await this._paymentRepository.updateInfo(paymentId, response.Authority);
    return {
      url: this.getPaymentLink(response.Authority),
      fields: null,
      bankName: 'درگاه تست',
    };
  }

  async sendRequest(url, data) {
    return {
      Status: 100,
      Authority: randomHex(10),
    };
  }

  async verify(
    paymentId: objectId,
    customerId: objectId,
    authority: string,
    merchantId: string
  ): Promise<PaymentEntity> {
    const paymentEntity = await this._paymentRepository.getOneOrFail(
      paymentId,
      customerId
    );

    const data = {
      MerchantID: merchantId,
      Authority: authority,
      Amount: paymentEntity.price,
    };
    const response = await this.sendRequest(
      this.getLinks().url + 'PaymentVerification.json',
      data
    );

    if (response.Status !== 100 && response.Status !== 101) {
      throw new BadRequestException(this.getError(response.Status));
    }

    const trackingCode = randomNumber(1, 10000000).toString();

    paymentEntity.trackingCode = trackingCode;
    await this._paymentRepository.update(paymentId, { trackingCode });

    return paymentEntity;
  }

  private getLinks() {
    return {
      url: 'https://www.test.com/',
      payment: 'https://www.test.com/StartPay/',
    };
  }
}
