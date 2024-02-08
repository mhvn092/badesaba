import { BookEntity } from '@lib/product/entities';
import {
  GetInfo,
  GetWithPaginationInfo,
  ModulesEnum,
  OrderDto,
  Paginate,
  PaginationDto,
  QueryOrder,
  QueryPagination,
  RouteTypeEnum,
  SharedControllerInfo,
  objectId,
} from '@lib/shared';
import { BadRequestException, Param, Query } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { BookService } from './book.service';
import { SearchBookFiltersDto, SelectedBooksResponseDto } from '@lib/product';
import { ObjectId } from 'mongodb';

@SharedControllerInfo(ModulesEnum.Book, 'book', RouteTypeEnum.PUBLIC)
export class BookPublicController {
  constructor(private readonly _bookService: BookService) {}

  @GetInfo('all/selected', null, {
    description: 'this route returns all the selected books per category',
    summary: 'get all  selected books ',
    outputType: SelectedBooksResponseDto,
    outputIsArray:true
  })
  findAll(): Promise<SelectedBooksResponseDto[]> {
    return this._bookService.getAllSelectedBooks();
  }

  @GetWithPaginationInfo(
    'category/:categoryId',
    {
      description: 'this route returns allBookEntity related ',
      summary: 'get allBookEntity by categoryId',
    },
    BookEntity,
    null,
    null,
    ['categoryId']
  )
  async findByCategory(
    @Param('categoryId') categoryId: objectId,
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto
  ): Promise<Paginate<BookEntity>> {
    if (!isMongoId(categoryId))
      throw new BadRequestException('you should specify a valid mongo id');

    const [BookEntities, total] = await this._bookService.findAllFilterd(
      pagination,
      order,
      { categoryId: { $eq: categoryId } }
    );

    return new Paginate(BookEntities, pagination.getPagination(total));
  }

  @GetWithPaginationInfo(
    'author/:authorId',
    {
      description: 'this route returns allBookEntity related ',
      summary: 'get allBookEntity by authorId',
    },
    BookEntity,
    null,
    null,
    ['authorId']
  )
  async findByAuthor(
    @Param('authorId') authorId: objectId,
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto
  ): Promise<Paginate<BookEntity>> {
    if (!isMongoId(authorId))
      throw new BadRequestException('you should specify a valid mongo id');

    const [BookEntities, total] = await this._bookService.findAllFilterd(
      pagination,
      order,
      { authorId: { $eq: authorId } }
    );

    return new Paginate(BookEntities, pagination.getPagination(total));
  }

  @GetInfo('by/:id', ['id'], {
    description:
      'this route returns theBookEntity requested by the id put in the param',
    summary: 'get one city',
    outputType: BookEntity,
  })
  findOne(@Param('id') id: objectId): Promise<BookEntity> {
    return this._bookService.findOne(id);
  }

  @GetInfo(
    'search',
    null,
    {
      description:
        'this route returns theBookEntity requested by the id put in the param',
      summary: 'get one city',
      outputType: BookEntity,
      outputIsArray: true,
    },
    'filters',
    SearchBookFiltersDto
  )
  search(
    @Query('filters') filters: SearchBookFiltersDto
  ): Promise<BookEntity[]> {
    return this._bookService.search(filters);
  }
}
