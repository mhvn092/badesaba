import { OmitType } from '@nestjs/swagger';
import { ARGConfigurationEntity } from '../../database/entities/general';
import { GLOBAL_EXCEPT_DTO } from '@spad/backend/shared';

export class CreateARGConfigurationDto extends OmitType(ARGConfigurationEntity, [
  ...GLOBAL_EXCEPT_DTO,
] as const) {}
