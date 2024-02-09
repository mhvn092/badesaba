import { CheckString } from '@lib/shared';

export class FinishOrderDto {
  @CheckString(false)
  deliveryTrackingCode: string;
}
