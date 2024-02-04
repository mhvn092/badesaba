import { CheckString } from '../decorators/custom-check-string.decorator';

export class TokensDto {
  @CheckString(false, false)
  accessToken: string;

  @CheckString(false, false)
  refreshToken: string;
}
