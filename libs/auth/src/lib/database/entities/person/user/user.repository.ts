import { OrderDto, PaginationDto, objectId } from '@lib/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Like, MongoRepository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { UserEntity } from './user.entity';
import { SearchFilters } from '../../../../dtos';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserRepository extends MongoRepository<UserEntity> {
  constructor(private _dataSource: DataSource) {
    super(UserEntity, _dataSource.createEntityManager());
  }

  getProfile(userId: objectId): Promise<UserEntity> {
    return this.getOneOrFail(userId, { isActive: true, isVerified: true });
  }

  getAll(
    conditions?: Partial<Record<keyof UserEntity, any>>
  ): Promise<UserEntity[]> {
    return this.find({
      where: { ...(conditions && { ...conditions }) },
      order: { created_at: 'DESC' },
    });
  }

  getAllWithPaginated(
    filters: SearchFilters,
    pagination: PaginationDto,
    order: OrderDto
  ): Promise<[UserEntity[], number]> {
    const options: FindManyOptions<UserEntity> = {
      where: {},
    };
    if (filters?.term) {
      options.where = [
        { firstName: Like(`%${filters.term}%`) },
        { lastName: Like(`%${filters.term}%`) },
        { email: Like(`%${filters.term}%`) },
      ];
    }
    if (filters?.badge) {
      Object.assign(options.where, { badge: filters.badge });
    }
    if (typeof filters?.isActive === 'boolean') {
      Object.assign(options.where, { isActive: filters.isActive });
    }
    if (typeof filters?.isVerify === 'boolean') {
      Object.assign(options.where, { isVerified: filters.isVerify });
    }

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
    conditions?: Partial<Record<keyof UserEntity, any>>
  ): Promise<UserEntity> {
    return this.findOne({
      where: { _id: new ObjectId(id), ...(conditions && { ...conditions }) },
    });
  }

  getByEmail(email: string): Promise<UserEntity> {
    return this.findOneBy({ email });
  }

  async getOneOrFail(
    id: objectId,
    conditions?: Partial<Record<keyof UserEntity, any>>
  ): Promise<UserEntity> {
    const user: UserEntity = await this.getOne(id, conditions);
    if (!user) throw new NotFoundException('کاربر یافت نشد');
    return user;
  }

  async destroy(id: string): Promise<void> {
    await this.softDelete(id);
  }

  add(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser: UserEntity = this.create(user);
    return this.save(newUser);
  }
}
