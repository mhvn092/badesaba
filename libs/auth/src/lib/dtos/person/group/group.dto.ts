import { ARGGroupEntity } from './../../../database/entities';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ActivationEnum, GLOBAL_EXCEPT_DTO } from '@spad/backend/shared';
import { IsEnum } from 'class-validator';

export class ARGGroupModel extends ARGGroupEntity {}

export class CreateARGGroupDto extends OmitType(ARGGroupModel, [
  'ownerId',
  'userGroups',
  ...GLOBAL_EXCEPT_DTO,
] as const) {}

export class UpdateARGGroupDto extends OmitType(ARGGroupModel, [
  'ownerId',
  'userGroups',
  ...GLOBAL_EXCEPT_DTO,
] as const) {}

export class UpdateARGIsActiveDto {
  @ApiProperty({ enum: ActivationEnum })
  @IsEnum(ActivationEnum)
  action: ActivationEnum;
}
