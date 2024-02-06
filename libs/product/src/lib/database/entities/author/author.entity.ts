import { CheckEnum, CheckString, SharedBaseEntity } from '@lib/shared';
import { Entity } from 'typeorm';
import { NationalityEnum } from '../../../enums';

@Entity({
  name: 'author',
})
export class AuthorEntity extends SharedBaseEntity {
  @CheckString()
  name: string;

  // @todo add image

  @CheckString()
  bio: string;

  // i could have made this into another entity and just give a refrence 
  // to it so that we could insert as needed

  @CheckEnum(NationalityEnum, true, true, NationalityEnum.Iranian)
  nationality: NationalityEnum;
}
