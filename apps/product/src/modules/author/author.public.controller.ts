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

  @GetInfo('featured', null, {
    description: 'this route returns all the featured author Entities',
    summary: 'get all featured author ',
    outputType: AuthorEntity,
    outputIsArray: true,
  })
  findAll(): Promise<AuthorEntity[]> {
    return this._authorService.getAllFeatured();
  }
}
