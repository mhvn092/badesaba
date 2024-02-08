import { GetInfo, RouteTypeEnum, objectId } from '@lib/shared';
import { PaymentService } from './payment.service';
import { Param, ParseUUIDPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ModulesEnum, SharedControllerInfo } from '@lib/shared';

@SharedControllerInfo(ModulesEnum.Payment, 'payment', RouteTypeEnum.PUBLIC)
export class PaymentPublicController {
  constructor(private readonly _paymentsService: PaymentService) {}

  @GetInfo(
    'verify/:paymentId',
    ['paymentId'],
    {
      description:
        'this route returns the payment that belongs to company requested by the id put in the param',
      summary: 'get one payment that belongs to company',
      outputType: null,
    },
    'Authority',
    String,
  )
  async verify(
    @Param('paymentId', ParseUUIDPipe) paymentId: objectId,
    @Query('Authority') authority: string,
    @Res() res: Response,
  ): Promise<void> {
    await this._paymentsService.payVerifyLogic(paymentId, authority, res);
  }
}
