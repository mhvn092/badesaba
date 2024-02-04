import { ARGPermissionEntity } from './../../../database/entities';
import { OmitType, PickType } from '@nestjs/swagger';
import { GLOBAL_EXCEPT_DTO } from '@spad/backend/shared';

export class ARGPermissionModel extends ARGPermissionEntity {}

export class CreateARGPermissionDto extends PickType(ARGPermissionModel, [
  'name',
  'scope',
  'type',
] as const) {}

export class CreateARGPermissionWithRoleIdDto extends OmitType(ARGPermissionModel, [
  ...GLOBAL_EXCEPT_DTO,
  'role',
] as const) {}

export class CreateARGBulkAssignPermission extends OmitType(ARGPermissionModel, [
  ...GLOBAL_EXCEPT_DTO,
  'role',
  'roleId',
] as const) {}

export class UpdateARGBulkPermissionDto extends OmitType(ARGPermissionModel, [
  'roleId',
  'role',
  ...GLOBAL_EXCEPT_DTO,
] as const) {}

export class UpdateARGPermissionDto extends OmitType(ARGPermissionModel, [
  ...GLOBAL_EXCEPT_DTO,
  'role',
] as const) {}
