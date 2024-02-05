import { Observable } from 'rxjs';
import { BadgeEnum } from '../../../enums/badge.enum';


export interface BodyAuthorizeInterface {
  token: string;
}

export interface ResponseAuthorizeInterface {
  id: string,
  type: BadgeEnum,
  name: string
}

export interface AuthorizationServiceInterface {
  authorize: (AuthorizeBody: BodyAuthorizeInterface) => Observable<ResponseAuthorizeInterface>;
}
