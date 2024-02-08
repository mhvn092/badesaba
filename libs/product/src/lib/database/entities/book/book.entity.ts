import {
  CheckNumber,
  CheckObjectId,
  CheckString,
  IsYear,
  SharedBaseEntity,
  objectId,
} from '@lib/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsISBN, IsPositive } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AuthorEntity } from '../author';
import { CategoryEntity } from '../category';

@Entity({
  name: 'book',
})
export class BookEntity extends SharedBaseEntity {
  @CheckString()
  name: string;

  @CheckString()
  description: string;

  @CheckString()
  @IsISBN()
  isbn: string;

  @CheckNumber()
  @IsYear()
  publishedYear: number;

  @CheckNumber()
  @IsPositive()
  numberOfPages: number;

  @CheckNumber(false, true, 1)
  @IsPositive()
  availability: number;

  @CheckNumber(false, true, 0)
  @IsPositive()
  salesCount: number;

  @CheckNumber()
  @IsPositive()
  price: number;

  @CheckObjectId('authorId')
  authorId: objectId;

  @Column(() => AuthorEntity)
  @ApiProperty({ type: () => AuthorEntity })
  author: AuthorEntity;

  @CheckObjectId('categoryId')
  categoryId: objectId;

  @Column(() => CategoryEntity)
  @ApiProperty({ type: () => CategoryEntity })
  category: CategoryEntity;
}
