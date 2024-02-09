import { ObjectId } from 'typeorm';
import { Payload } from '../interfaces/payload.interface';
import { BadgeEnum } from '../enums';

export class UserAuthModel implements Payload {
  _id: ObjectId;
  isActive: boolean;
  email: string;
  clientId?: string;
  badge: BadgeEnum;

  constructor(obj: Payload) {
    Object.assign(this, { ...obj });
  }
}
