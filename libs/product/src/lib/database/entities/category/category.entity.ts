import { CheckEnum, CheckString, SharedBaseEntity } from '@lib/shared';
import { CategoryTypeEnum } from '../../../enums';
import { Entity } from 'typeorm';

@Entity({
  name: 'cateogry',
})
export class CategoryEntity extends SharedBaseEntity {
  @CheckString()
  name: string;

  // @todo add Other info like icon and stuff

  @CheckEnum(CategoryTypeEnum, true, true, CategoryTypeEnum.Fiction)
  type: CategoryTypeEnum;
}
