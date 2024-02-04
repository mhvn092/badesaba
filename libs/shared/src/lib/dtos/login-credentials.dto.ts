import { CheckString } from '../decorators/custom-check-string.decorator';

export class LoginCredentialsDto{
  @CheckString(false,false)
  username: string;

  @CheckString(false,false)
  password: string;
}
