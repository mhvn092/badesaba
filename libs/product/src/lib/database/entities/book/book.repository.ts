import {
  OrderDto,
  PaginationDto,
  UpdateResultModel,
  objectId,
  responseWrapper,
} from '@lib/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { DataSource, MongoRepository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { BookEntity } from './book.entity';
import { SearchBookFiltersDto, SelectedBooksResponseDto } from '../../../dtos';

@Injectable()
export class BookRepository extends MongoRepository<BookEntity> {
  constructor(private _dataSource: DataSource) {
    super(BookEntity, _dataSource.createEntityManager());
  }

  getAll(
    conditions?: Partial<Record<keyof BookEntity, any>>
  ): Promise<BookEntity[]> {
    return this.find({
      where: { ...(conditions && { ...conditions }) },
      order: { created_at: 'DESC' },
    });
  }

  getAllWithPaginated(
    pagination: PaginationDto,
    order: OrderDto,
    conditions?: Partial<Record<keyof BookEntity, any>>
  ): Promise<[BookEntity[], number]> {
    const options: FindManyOptions<BookEntity> = {
      ...(conditions && { where: conditions }),
    };

    if (order?.order) {
      options.order = { [order.order]: order.orderBy };
    } else {
      options.order = { created_at: 'DESC' };
    }
    if (pagination) {
      options.skip = pagination.skip;
      options.take = pagination.size;
    }
    return this.findAndCount(options);
  }

  getOne(
    id: objectId,
    conditions?: Partial<Record<keyof BookEntity, any>>
  ): Promise<BookEntity> {
    return this.findOne({
      where: { _id: new ObjectId(id), ...(conditions && { ...conditions }) },
    });
  }

  async getOneOrFail(
    id: objectId,
    conditions?: Partial<Record<keyof BookEntity, any>>
  ): Promise<BookEntity> {
    const user: BookEntity = await this.getOne(id, conditions);
    if (!user) throw new NotFoundException('کتاب یافت نشد');
    return user;
  }

  search(filters: SearchBookFiltersDto) {
    return this.find({
      $text: { $search: filters.term },
      ...(filters.publishingYear && { publishedYear: filters.publishingYear }),
    });
  }

  destroy(id: objectId): Promise<UpdateResultModel> {
    return this.update(id, { deletedAt: new Date() }).then((res) => ({
      status: !!res.affected,
    }));
  }

  add(book: Partial<BookEntity>): Promise<BookEntity> {
    return this.save(book).then((res) => responseWrapper(BookEntity, res));
  }

  async getTopFiveBooksPerCategory(
    categoryIds: objectId[]
  ): Promise<SelectedBooksResponseDto[]> {
    const result = this.aggregate([
      {
        $match: {
          categoryId: { $nin: categoryIds },
          availability: { $gt: 0 },
        },
      },
      {
        $sort: { categoryId: 1, salesCount: -1 }, // Sort by category and salesCount
      },
      {
        $group: {
          _id: { categoryId: '$categoryId', name: '$category.name' },
          books: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          categoryId: '$_id.categoryId',
          name: '$_id.name',
          _id: 0,
          books: { $slice: ['$books', 5] }, // Get top 5 books per category
        },
      },
    ]);

    const results = await result.toArray();
    
    return responseWrapper(SelectedBooksResponseDto,results);
  }
}
