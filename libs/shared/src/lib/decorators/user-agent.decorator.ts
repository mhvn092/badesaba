import { HeaderNames } from '@spad/shared/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAgent = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers[HeaderNames.USER_AGENT];
});
