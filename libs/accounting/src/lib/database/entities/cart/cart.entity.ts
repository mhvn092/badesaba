import {
  CheckBoolean,
  CheckNumber,
  CheckObjectId,
  SharedBaseEntity,
  objectId
} from '@lib/shared';
import { Entity } from 'typeorm';

@Entity({
  name: 'cart',
})
export class CartEntity extends SharedBaseEntity {
  @CheckNumber(true)
  total?: number;

  @CheckObjectId('userId')
  userId: objectId;

  @CheckBoolean()
  isActive: boolean;

}
