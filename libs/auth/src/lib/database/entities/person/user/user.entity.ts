import {
  BadgeEnum,
  CheckBoolean,
  CheckEnum,
  CheckString,
  SharedBaseEntity,
} from '@lib/shared';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Entity } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends SharedBaseEntity {
  @CheckString(true)
  firstName?: string;

  @CheckString(true)
  lastName?: string;

  @CheckString(true, true, true)
  @IsEmail()
  email: string;

  @CheckString()
  @Exclude()
  password: string;

  @CheckBoolean()
  isVerified: boolean;

  @CheckBoolean()
  isActive: boolean;

  @CheckEnum(BadgeEnum, true, true, BadgeEnum.Guest)
  badge?: BadgeEnum;

  get fullName(): string {
    return this.firstName + '' + this.lastName;
  }
}
