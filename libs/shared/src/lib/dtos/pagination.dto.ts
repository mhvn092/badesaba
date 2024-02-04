import { Pagination } from '../classes';
import { CheckNumber } from '../decorators/custom-check-number.decorator';

export class PaginationDto {
  constructor(obj?: Partial<PaginationDto>) {
    if (obj) Object.assign(this, obj);
  }

  @CheckNumber(false,false)
  page = 0;

  @CheckNumber(false,false)
  size = 100;

  get skip() {
    return (this.page - 1) * this.size;
  }

  getPagination(total): Pagination {
    const pagination: Pagination = new Pagination();
    pagination.page = this.page;
    pagination.size = this.size;
    pagination.skip = this.skip;
    pagination.total = total;
    return pagination;
  }
}
