import { AuthorEntity } from '@lib/product/entities';
import {
  GetInfo,
  ModulesEnum,
  RouteTypeEnum,
  SharedControllerInfo,
} from '@lib/shared';
import { AuthorService } from './author.service';

@SharedControllerInfo(ModulesEnum.Author, 'author', RouteTypeEnum.PUBLIC)
export class AuthorPublicController {
  constructor(private readonly _authorService: AuthorService) {}

  @GetInfo('all/works', null, {
    description: 'this route returns all the works of author Entity',
    summary: 'get all  authors work ',
    outputType: AuthorEntity,
    outputIsArray: true,
  })
  findAll(): Promise<AuthorEntity[]> {
    return this._authorService.getAllWithoutPagination();
  }
}
