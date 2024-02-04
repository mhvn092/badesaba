export class ARGVerifyPaymentDto {
  callback: string = null;
  success = false;
  error: Error = null;
  message: string = null;
  trackingCode: string = null;
  paymentId: string = null;

  constructor(obj: Partial<ARGVerifyPaymentDto>) {
    Object.assign(this, obj);
  }
}
