import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CheckNumber } from '../decorators';

export class Pagination {
  @CheckNumber(false, false)
  page: number;

  @CheckNumber(false, false)
  size: number;

  @CheckNumber(false, false)
  total: number;

  @CheckNumber(true, false)
  skip?: number;
}

export class Paginate<TData> {
  constructor(items: TData[], pagination: Pagination) {
    this.items = items;
    this.pagination = pagination;
  }

  @ApiProperty()
  pagination: Pagination;

  items: TData[];
}
