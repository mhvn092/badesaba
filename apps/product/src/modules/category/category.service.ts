import { CreateCategoryDto, UpdateCategoryDto } from '@lib/product';
import { CategoryEntity, CategoryRepository } from '@lib/product/entities';
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
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(
    private readonly _categoryRepository: CategoryRepository,
    private readonly _redisHelperService: RedisHelperService
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    this._deleteAllRedisCache();
    return this._categoryRepository.add(createCategoryDto);
  }

  async getAllWithoutPagination(): Promise<CategoryEntity[]> {
    const key = this._getAllRedisKey();
    const resultFromRedis = await this._redisHelperService.getCache<
      CategoryEntity[]
    >(key);

    if (resultFromRedis?.length) return resultFromRedis;

    const resultFromDb = await this._categoryRepository.find();

    if (!resultFromDb?.length) return;

    this._redisHelperService.setCache<CategoryEntity[]>(key, resultFromDb);

    return resultFromDb;
  }

  findAll(
    pagination: PaginationDto,
    order: OrderDto
  ): Promise<[CategoryEntity[], number]> {
    return this._categoryRepository.getAllWithPaginated(pagination, order);
  }

  findOne(id: objectId): Promise<CategoryEntity> {
    return this._categoryRepository.getOneOrFail(id);
  }

  async update(
    id: objectId,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<UpdateResultModel> {
    await this._categoryRepository.getOneOrFail(id);

    this._deleteAllRedisCache();

    return this._categoryRepository
      .update(id, updateCategoryDto)
      .then((res) => ({
        status: !!res.affected
      }));
  }

  async remove(categoryId: objectId): Promise<UpdateResultModel> {
    await this._categoryRepository.getOneOrFail(categoryId);

    // const relatedBook = await this._activityRepository.findOneBy({ activityCategoryId });
    // if (relatedActivity) {
    //   throw new BadRequestException('there is related activity to this category');
    // }
    this._deleteAllRedisCache();

    return this._categoryRepository.destroy(categoryId);
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
