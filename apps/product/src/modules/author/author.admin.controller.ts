import { CreateAuthorDto, UpdateAuthorDto } from '@lib/product';
import { AuthorEntity } from '@lib/product/entities';
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
import { Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { AuthorService } from './author.service';

@SharedControllerInfo(ModulesEnum.Author, 'author', RouteTypeEnum.ADMIN)
export class AuthorAdminController {
  constructor(private readonly _authorService: AuthorService) {}

  @PostInfo('', CreateAuthorDto, false, {
    description: 'this route creates a author and returns the result',
    summary: 'createAuthorEntity',
    outputType: AuthorEntity,
  })
  create(
    @Body() createAuthorDto: CreateAuthorDto
  ): Promise<AuthorEntity> {
    return this._authorService.create(createAuthorDto);
  }

  @GetWithPaginationInfo(
    'all',
    {
      description: 'this route returns allAuthorEntity related ',
      summary: 'get allAuthorEntity',
    },
    AuthorEntity
  )
  async findAll(
    @QueryPagination() pagination: PaginationDto,
    @QueryOrder() order: OrderDto
  ): Promise<Paginate<AuthorEntity>> {
    const [authorEntities, total] = await this._authorService.findAll(
      pagination,
      order
    );

    return new Paginate(authorEntities, pagination.getPagination(total));
  }

  @GetInfo(':id', ['id'], {
    description:
      'this route returns theAuthorEntity requested by the id put in the param',
    summary: 'get one city',
    outputType: AuthorEntity,
  })
  findOne(@Param('id', ParseUUIDPipe) id: objectId): Promise<AuthorEntity> {
    return this._authorService.findOne(id);
  }

  @PutInfo(':id', ['id'], UpdateAuthorDto, false, {
    description: 'this route can edit hisAuthorEntity',
    summary: 'edit hisAuthorEntity',
    outputType: UpdateResultModel,
  })
  update(
    @Param('id', ParseUUIDPipe) id: objectId,
    @Body() udateAuthorDto: UpdateAuthorDto
  ): Promise<UpdateResultModel> {
    return this._authorService.update(id, udateAuthorDto);
  }

  @DeleteInfo(':id', ['id'], {
    summary: 'delete oneAuthorEntity',
    description: 'this route deletes oneAuthorEntity',
  })
  remove(@Param('id', ParseUUIDPipe) id: objectId): Promise<UpdateResultModel> {
    return this._authorService.remove(id);
  }
}
