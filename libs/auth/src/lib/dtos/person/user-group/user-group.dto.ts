import { ARGUserGroupEntity } from './../../../database/entities';
import { PickType } from '@nestjs/swagger';

export class ARGUserGroupModel extends ARGUserGroupEntity {}

export class CreateARGAssignUserToGroup extends PickType(ARGUserGroupModel, [
  'userId',
  'groupId',
] as const) {}
