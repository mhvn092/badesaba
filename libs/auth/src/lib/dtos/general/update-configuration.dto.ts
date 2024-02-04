import { PickType } from '@nestjs/swagger';
import { CreateARGConfigurationDto } from './create-configuration.dto';

export class UpdateARGConfigurationDto extends PickType(CreateARGConfigurationDto, [
  'value',
] as const) {}
