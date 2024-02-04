import { HeaderNames, Payload, UserAuthModel } from '@lib/shared';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ObjectId } from 'typeorm';

export const User = createParamDecorator(
  (
    data: keyof UserAuthModel,
    ctx: ExecutionContext
  ): string | ObjectId | boolean | UserAuthModel => {
    const request = ctx.switchToHttp().getRequest();
    const userPayload: Payload = request[HeaderNames.USER];
    const clientId = request.headers[HeaderNames.DEVICE_ID];
    const user: UserAuthModel = new UserAuthModel({
      ...userPayload,
      ...(clientId && { clientId }),
    });
    return data ? user[data] : user;
  }
);
