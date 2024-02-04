import { BadgeEnum, CheckBoolean, CheckEnum, CheckString, GLOBAL_EXCEPT_DTO } from '@lib/shared';
import {
  OmitType,
  PickType
} from '@nestjs/swagger';
import { UserEntity } from '../../../database/entities/person/user/user.entity';

export class UserModel extends UserEntity {}

export class RegisterDto extends PickType(UserModel, [
  'firstName',
  'lastName',
  'email',
  'badge'
]) {
  @CheckString(false, false)
  password: string;
}

export class LoginDto extends PickType(UserModel, ['email']) {
  @CheckString(false, false)
  password: string;
}

export class ForgotPasswordDto extends PickType(UserModel, ['email'] as const) {}

export class UpdateProfileDto extends OmitType(UserModel, [
  ...GLOBAL_EXCEPT_DTO,
  'isActive',
  'isVerified',
  'password',
  'email',
  'badge',
] as const) {}


export class AdminProfileDto extends UpdateProfileDto {
  @CheckString(false, false)
  userId: string;
}

export class VerifyEmailDto extends PickType(UserModel, ['email', '_id'] as const) {
  @CheckString(false, false)
  token: string;
}

export class ResetPasswordDto extends VerifyEmailDto {
  @CheckString(false, false)
  password: string;
}

export class UpdatePasswordDto {
  @CheckString(false, false)
  password: string;

  @CheckString(true, false)
  oldPassword?: string;
}


export class SearchFilters {
  @CheckString(true, false)
  term?: string;

  @CheckBoolean(true, false)
  isActive?: boolean;

  @CheckBoolean(true, false)
  isVerify?: boolean;

  @CheckEnum(BadgeEnum,true,false)
  badge?: BadgeEnum;
}
