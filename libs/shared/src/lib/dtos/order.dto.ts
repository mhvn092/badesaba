import { CheckString } from '../decorators/custom-check-string.decorator';

export class OrderDto {
  constructor(obj?: Partial<OrderDto>) {
    if (obj) Object.assign(this, obj);
  }
  @CheckString(true,false)
  orderBy: string;

  @CheckString(true,false)
  order: string;
}
