import { AdminProfileDto, AuthControllerInfo, SearchFilters } from '@lib/auth';
import { UserEntity } from '@lib/auth/entities';
import {
  GetInfo,
  GetWithPaginationInfo,
  ModulesEnum,
  OrderDto,
  Paginate,
  PaginationDto,
  PutInfo,
  QueryOrder,
  QueryPagination,
  RouteTypeEnum,
  objectId,
} from '@lib/shared';
import { Body, Param, Query } from '@nestjs/common';
import { PersonService } from './person.service';

@AuthControllerInfo(ModulesEnum.Person, 'person', RouteTypeEnum.ADMIN)
export class PersonAdminController {
  constructor(private readonly _personService: PersonService) {}

  @GetWithPaginationInfo(
    '/',
    { summary: 'get list of users with pagination' },
    UserEntity,
    'filters',
    SearchFilters
  )
  async getAllWithPaginated(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto,
    @Query('filters') filters: SearchFilters
  ): Promise<Paginate<UserEntity>> {
    const [users, total] = await this._personService.getAllWithPagination(
      pagination,
      order,
      filters
    );
    return new Paginate(users, pagination.getPagination(total));
  }

  @GetInfo('/:id', ['id'], {
    summary: 'get a user by id',
    outputType: UserEntity,
  })
  getOne(@Param('id') userId: objectId): Promise<UserEntity> {
    return this._personService.getOne(userId);
  }

  @PutInfo('/profile', null, AdminProfileDto, false, {
    summary: 'update user profile',
  })
  async updateProfile(
    @Body() { userId, ...args }: AdminProfileDto
  ): Promise<void> {
    await this._personService.updateProfile(userId, args);
  }

  @PutInfo('active/:userId', ['userId'], null, false, {
    summary: 'activate or deactivate user by admin',
    description: 'this route activates or deactivates a user',
  })
  activateUser(@Param('userId') userId: objectId): Promise<void> {
    return this._personService.activateUser(userId);
  }
}
