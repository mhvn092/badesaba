import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HeaderNames } from '../enums/header-name.enum';

export const UserAgent = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers[HeaderNames.USER_AGENT];
  }
);
