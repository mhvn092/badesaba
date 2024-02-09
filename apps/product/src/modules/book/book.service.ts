import {
  CreateBookDto,
  SearchBookFiltersDto,
  SelectedBooksResponseDto,
  UpdateBookDto,
} from '@lib/product';
import { BookEntity } from '@lib/product/entities';
import {
  GetAvailabilityResponseItemInterface,
  OrderDto,
  PaginationDto,
  RedisPrefixesEnum,
  RedisServiceEnum,
  RedisSubPrefixesEnum,
  UpdateResultModel,
  objectId,
} from '@lib/shared';
import { RedisHelperService } from '@lib/shared/modules/redis-helper';
import { Injectable } from '@nestjs/common';
import { BookRepository } from 'libs/product/src/lib/database/entities/book';
import { AuthorService } from '../author/author.service';
import { CategoryService } from '../category/category.service';
import {
  GetAvailabilityRequestInterface,
  ReduceAvailibilityRequestInterface,
  ReduceAvailibilityResponseInterface,
} from '@lib/shared/modules/product-client';
import { In } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class BookService {
  constructor(
    private readonly _authorService: AuthorService,
    private readonly _categoryService: CategoryService,
    private readonly _bookRepository: BookRepository,
    private readonly _redisHelperService: RedisHelperService
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookEntity> {
    const [author, category] = await Promise.all([
      this._authorService.findOne(createBookDto.authorId),
      this._categoryService.findOne(createBookDto.categoryId),
    ]);

    const bookInsance = this._bookRepository.create(createBookDto);
    bookInsance.author = author;
    bookInsance.category = category;

    return this._bookRepository.add(bookInsance);
  }

  async getAllSelectedBooks(): Promise<SelectedBooksResponseDto[]> {
    const key = this._getSelectedRedisKey();
    const resultFromRedis = await this._redisHelperService.getCache<
      SelectedBooksResponseDto[]
    >(key);

    if (resultFromRedis?.length) return resultFromRedis;

    const featureCategories = await this._categoryService.getFeatured();

    const resultFromDb = await this._bookRepository.getTopFiveBooksPerCategory(
      featureCategories.map((item) => item._id)
    );

    if (!resultFromDb?.length) return;

    this._redisHelperService.setCache<SelectedBooksResponseDto[]>(
      key,
      resultFromDb
    );

    return resultFromDb;
  }

  findAll(
    pagination: PaginationDto,
    order: OrderDto
  ): Promise<[BookEntity[], number]> {
    return this._bookRepository.getAllWithPaginated(pagination, order);
  }

  findAllFilterd(
    pagination: PaginationDto,
    order: OrderDto,
    conditions: Partial<Record<keyof BookEntity, any>>
  ): Promise<[BookEntity[], number]> {
    return this._bookRepository.getAllWithPaginated(
      pagination,
      order,
      conditions
    );
  }

  findOne(id: objectId): Promise<BookEntity> {
    return this._bookRepository.getOneOrFail(id);
  }

  search(filters: SearchBookFiltersDto): Promise<BookEntity[]> {
    return this._bookRepository.search(filters);
  }

  async update(
    id: objectId,
    updateBookDto: UpdateBookDto
  ): Promise<UpdateResultModel> {
    await this._bookRepository.getOneOrFail(id);

    this._deleteSelectedRedisCache();

    return this._bookRepository.update(id, updateBookDto).then((res) => ({
      status: !!res.affected,
    }));
  }

  async getAvailabilities(
    request: GetAvailabilityRequestInterface
  ): Promise<GetAvailabilityResponseItemInterface[]> {
    const books = await this._bookRepository.find({
      where: {
        _id: { $in: request.bookIds.map(item => new ObjectId(item)) },
      },
    });
    return books?.map((item) => ({
      bookId: item._id.toString(),
      availability: item.availability,
      price: item.price,
      name: item.name,
    }));
  }

  async reduceAvailabilities(
    request: ReduceAvailibilityRequestInterface[]
  ): Promise<ReduceAvailibilityResponseInterface> {
    const books = await this._bookRepository.find({
      where: {
        _id: In(request.map((item) => item.bookId)),
      },
    });
    const promises = [];
    books.forEach((item) => {
      const book = request.find((sent) => sent.bookId === item._id.toString());
      const quantity = item.availability - book.quantity;
      promises.push(
        this._bookRepository.update(item._id, {
          availability: quantity > 0 ? quantity : 0,
          salesCount: item.salesCount + quantity,
        })
      );
    });
    try {
      await Promise.all(promises);
      return { status: true };
    } catch (e) {
      console.error('some error happend', e);
      return { status: false };
    }
  }

  async remove(authorId: objectId): Promise<UpdateResultModel> {
    await this._bookRepository.getOneOrFail(authorId);

    this._deleteSelectedRedisCache();
    // @todo Should check if there is an ongoing order

    return this._bookRepository.destroy(authorId);
  }

  private _deleteSelectedRedisCache() {
    this._redisHelperService.removeCache(this._getSelectedRedisKey());
  }

  private _getSelectedRedisKey() {
    return this._redisHelperService.getStandardKeyWithoutId(
      RedisServiceEnum.Product,
      RedisPrefixesEnum.Category,
      RedisSubPrefixesEnum.Selected
    );
  }
}
