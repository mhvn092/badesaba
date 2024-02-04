import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { GLOBAL_EXCEPT_DTO } from '@spad/backend/shared';
import { uuid } from '@spad/shared/common';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ARGUserRoleEntity } from './../../../database/entities';

export class ARGUserRoleModel extends ARGUserRoleEntity {}

export class CreateARGBulkAssignRolesToUserDto extends PickType(ARGUserRoleModel, [
  'userId',
] as const) {
  @ApiProperty({ format: 'uuid', type: String, isArray: true })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  roleIds: Array<uuid>;
}

export class CreateARGUserRoleDto extends OmitType(ARGUserRoleModel, [
  ...GLOBAL_EXCEPT_DTO,
] as const) {}

export class UpdateARGAssignRoleDto extends PickType(ARGUserRoleModel, [
  'userId',
  'roleId',
] as const) {
  @ApiProperty()
  @IsUUID()
  newRoleId: uuid;
}
