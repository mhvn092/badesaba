import { ApiProperty } from '@nestjs/swagger';
import { CheckString } from '../decorators';

export class LoginCredentialsDto{
  @CheckString(false,false)
  username: string;

  @CheckString(false,false)
  password: string;
}
