import { objectId } from "@lib/shared";

export class VerifyPaymentDto {
  callback: string = null;
  success = false;
  error: Error = null;
  message: string = null;
  trackingCode: string = null;
  paymentId: objectId = null;

  constructor(obj: Partial<VerifyPaymentDto>) {
    Object.assign(this, obj);
  }
}
