import { CreateAuthorDto, UpdateAuthorDto } from '@lib/product';
import { AuthorEntity, AuthorRepository } from '@lib/product/entities';
import {
  OrderDto,
  PaginationDto,
  RedisPrefixesEnum,
  RedisServiceEnum,
  RedisSubPrefixesEnum,
  UpdateResultModel,
  objectId,
} from '@lib/shared';
import { RedisHelperService } from '@lib/shared/modules/redis-helper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRepository } from 'libs/product/src/lib/database/entities/book';

@Injectable()
export class AuthorService {
  constructor(
    private readonly _authorRepository: AuthorRepository,
    private readonly _bookRepository: BookRepository,
    private readonly _redisHelperService: RedisHelperService
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorEntity> {
    this._deleteAllRedisCache();
    return this._authorRepository.add(createAuthorDto);
  }

  async getAllFeatured(): Promise<AuthorEntity[]> {
    const key = this._getAllRedisKey();
    const resultFromRedis = await this._redisHelperService.getCache<
      AuthorEntity[]
    >(key);

    if (resultFromRedis?.length) return resultFromRedis;

    const resultFromDb = await this._authorRepository.find({
      where: { isFeatured: true },
    });

    if (!resultFromDb?.length) return;

    this._redisHelperService.setCache<AuthorEntity[]>(key, resultFromDb);

    return resultFromDb;
  }

  findAll(
    pagination: PaginationDto,
    order: OrderDto
  ): Promise<[AuthorEntity[], number]> {
    return this._authorRepository.getAllWithPaginated(pagination, order);
  }

  findOne(id: objectId): Promise<AuthorEntity> {
    return this._authorRepository.getOneOrFail(id);
  }

  async update(
    id: objectId,
    updateAuthorDto: UpdateAuthorDto
  ): Promise<UpdateResultModel> {
    await this._authorRepository.getOneOrFail(id);

    this._deleteAllRedisCache();

    return this._authorRepository.update(id, updateAuthorDto).then((res) => ({
      status: !!res.affected,
    }));
  }

  async remove(authorId: objectId): Promise<UpdateResultModel> {
    await this._authorRepository.getOneOrFail(authorId);

    const relatedBook = await this._bookRepository.findOneBy({ authorId });
    if (relatedBook) {
      throw new BadRequestException('there is related book to this author');
    }
    this._deleteAllRedisCache();

    return this._authorRepository.destroy(authorId);
  }

  private _deleteAllRedisCache() {
    this._redisHelperService.removeCache(this._getAllRedisKey());
  }

  private _getAllRedisKey() {
    return this._redisHelperService.getStandardKeyWithoutId(
      RedisServiceEnum.Product,
      RedisPrefixesEnum.Category,
      RedisSubPrefixesEnum.All
    );
  }
}
