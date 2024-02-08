import { CheckString } from '@lib/shared';

export class PaymentGatewayResultDto {
  @CheckString(true, false)
  url?: string;

  @CheckString(true, false)
  gateway?: string;

  @CheckString(true, false)
  errorMessage?: string;

  constructor(data: Partial<PaymentGatewayResultDto>) {
    Object.assign(this, data);
  }
}
