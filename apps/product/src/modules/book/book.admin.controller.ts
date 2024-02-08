import { CreateBookDto, UpdateBookDto } from '@lib/product';
import { BookEntity } from '@lib/product/entities';
import {
  DeleteInfo,
  GetInfo,
  GetWithPaginationInfo,
  ModulesEnum,
  OrderDto,
  Paginate,
  PaginationDto,
  PostInfo,
  PutInfo,
  QueryOrder,
  QueryPagination,
  RouteTypeEnum,
  SharedControllerInfo,
  UpdateResultModel,
  objectId,
} from '@lib/shared';
import { Body, Param } from '@nestjs/common';
import { BookService } from './book.service';

@SharedControllerInfo(ModulesEnum.Book, 'book', RouteTypeEnum.ADMIN)
export class BookAdminController {
  constructor(private readonly _bookService: BookService) {}

  @PostInfo('', CreateBookDto, false, {
    description: 'this route creates a Book and returns the result',
    summary: 'createBookEntity',
    outputType: BookEntity,
  })
  create(
    @Body() createBookDto: CreateBookDto
  ): Promise<BookEntity> {
    return this._bookService.create(createBookDto);
  }

  @GetWithPaginationInfo(
    'all',
    {
      description: 'this route returns allBookEntity related ',
      summary: 'get allBookEntity',
    },
    BookEntity
  )
  async findAll(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto
  ): Promise<Paginate<BookEntity>> {
    const [BookEntities, total] = await this._bookService.findAll(
      pagination,
      order
    );

    return new Paginate(BookEntities, pagination.getPagination(total));
  }



  @PutInfo(':id', ['id'], UpdateBookDto, false, {
    description: 'this route can edit hisBookEntity',
    summary: 'edit hisBookEntity',
    outputType: UpdateResultModel,
  })
  update(
    @Param('id') id: objectId,
    @Body() updateBookDto: UpdateBookDto
  ): Promise<UpdateResultModel> {
    return this._bookService.update(id, updateBookDto);
  }

  @DeleteInfo(':id', ['id'], {
    summary: 'delete oneBookEntity',
    description: 'this route deletes oneBookEntity',
  })
  remove(@Param('id') id: objectId): Promise<UpdateResultModel> {
    return this._bookService.remove(id);
  }
}
