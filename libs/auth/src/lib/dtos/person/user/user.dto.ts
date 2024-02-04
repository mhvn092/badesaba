import { ARGUserEntity } from './../../../database/entities';
import { ApiProperty, ApiPropertyOptional, OmitType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  ActivationEnum,
  BadgeEnum,
  booleanTransform,
  GLOBAL_EXCEPT_DTO,
  VerificationEnum,
} from '@spad/backend/shared';
import { uuid } from '@spad/shared/common';
import { Transform } from 'class-transformer';

export class ARGUserModel extends ARGUserEntity {}

export class ARGUserForgetPasswordWithEmail extends PickType(ARGUserModel, ['email'] as const) {}

export class ARGUserForgetPasswordWithMobile extends PickType(ARGUserModel, ['mobile'] as const) {}

export class ARGUpdateProfile extends OmitType(ARGUserModel, [
  ...GLOBAL_EXCEPT_DTO,
  'mobile',
  'avatar',
  'client',
  'isActive',
  'isVerified',
  'password',
  'userRoles',
  'avatarLink',
  'avatar',
  'avatarFileId',
] as const) {}

export class ARGUpdatePassword {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  oldPassword?: string;
}

export class ARGUpdateAvatarDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  avatarFileId: uuid;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: uuid;
}

export class ARGUpdateAvatarResponseDto extends PickType(ARGUserModel, ['avatarLink']) {
  constructor(obj: Partial<ARGUpdateAvatarResponseDto>) {
    super();
    Object.assign(this, obj);
  }
}

export class ARGUpdateSetPassword {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId: uuid;

  @ApiProperty()
  @IsString()
  password: string;
}

export class ARGUpdateUserActive {
  @ApiProperty({ enum: ActivationEnum })
  @IsEnum(ActivationEnum)
  action: ActivationEnum;
}

export class ARGUpdateUserVerify {
  @ApiProperty({ enum: VerificationEnum })
  @IsEnum(VerificationEnum)
  action: VerificationEnum;
}

export class ARGSearchFilters {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  term?: string;

  @ApiPropertyOptional()
  @Transform((param) => booleanTransform(param))
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @Transform((param) => booleanTransform(param))
  @IsBoolean()
  @IsOptional()
  isVerify?: boolean;

  @ApiPropertyOptional({ enum: BadgeEnum })
  @IsEnum(BadgeEnum)
  @IsOptional()
  badge?: BadgeEnum;
}

export class ARGUpdateForgetPassword extends PickType(ARGUserModel, ['email', 'id'] as const) {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
