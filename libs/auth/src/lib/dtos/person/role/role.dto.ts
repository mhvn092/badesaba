import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { GLOBAL_EXCEPT_DTO } from '@spad/backend/shared';
import { uuid } from '@spad/shared/common';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateARGPermissionDto } from '../permission';
import { ARGRoleEntity } from './../../../database/entities';

export class ARGRoleModel extends ARGRoleEntity {}

export class CreateARGRoleDto extends OmitType(ARGRoleModel, [
  ...GLOBAL_EXCEPT_DTO,
  'userRoles',
  'permissions',
] as const) {
  @ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  panelMenuIds: uuid[];
}

export class UpdateARGRoleDto extends PickType(ARGRoleModel, [
  'name',
  'widgets',
  'menuInDashboard',
] as const) {
  @ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  panelMenuIds: uuid[];
}

export class CreateARGRoleWithPermissions extends PickType(ARGRoleModel, [
  'name',
  'scope',
  'isForGroup',
] as const) {
  @ApiProperty({ type: () => CreateARGPermissionDto, isArray: true })
  @Type(() => CreateARGPermissionDto)
  @IsInstance(CreateARGPermissionDto, { each: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  permissions: CreateARGPermissionDto[];
}
