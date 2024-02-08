import { PickType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PickType(CreateBookDto, [
  'availability',
  'price',
] as const) {}
