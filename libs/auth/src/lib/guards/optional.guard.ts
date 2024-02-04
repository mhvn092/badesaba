import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './user.guard';
import { HeaderNames } from '@lib/shared';


/**
 * when using this guard, if the user is logged in, the user details will be returned, otherwise, the fingerprint will be used
 **/
export class OptionalGuard extends JwtAuthGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {
    super(reflector);
  }

  override async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const user = request[HeaderNames.USER];
    if (!user && request.headers && request.headers[HeaderNames.AUTHORIZATION]) {
      return super.canActivate(context);
    } else {
      return true;
    }
  }
}
