import { ObjectId } from 'typeorm';
import { Payload } from '../interfaces/payload.interface';

export class UserAuthModel implements Payload {
  _id: ObjectId;
  isActive: boolean;
  email: string;
  clientId?: string;

  constructor(obj: Payload) {
    Object.assign(this, { ...obj });
  }
}
