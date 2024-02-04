import { CheckString } from '../decorators/custom-check-string.decorator';

export class JwtRefreshDto {
  @CheckString(false,false)
  refreshToken: string | null;
}
