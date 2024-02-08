import { ApiProperty, PickType } from '@nestjs/swagger';
import { BookEntity } from '../../database/entities/book';
import { Type } from 'class-transformer';

export class SelectedBooksResponseDto extends PickType(BookEntity, [
  'name',
  'categoryId',
] as const) {
  @Type(() => BookEntity)
  @ApiProperty({ type: () => BookEntity, isArray: true })
  books: BookEntity[];
}
