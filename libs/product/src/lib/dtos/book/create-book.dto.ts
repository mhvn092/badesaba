import { PickType } from '@nestjs/swagger';
import { BookEntity } from '../../database/entities/book';

export class CreateBookDto extends PickType(BookEntity, [
  'name',
  'authorId',
  'availability',
  'categoryId',
  'description',
  'isbn',
  'numberOfPages',
  'price',
  'publishedYear',
] as const) {}
