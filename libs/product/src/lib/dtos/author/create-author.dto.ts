import { PickType } from '@nestjs/swagger';
import { AuthorEntity } from '../../database/entities/author';

export class CreateAuthorDto extends PickType(AuthorEntity, [
  'name',
  'bio',
  'nationality',
  'isFeatured'
] as const) {}
