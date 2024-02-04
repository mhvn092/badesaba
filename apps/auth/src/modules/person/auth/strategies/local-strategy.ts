import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { HeaderNames } from '@lib/shared';
import { UserEntity } from '@lib/auth/entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super({ passReqToCallback: true, usernameField: 'email' });
  }

  async validate(request: Request, email: string, password: string): Promise<unknown> {
    if (!request.headers[HeaderNames.USER_AGENT]) {
      throw new Error('user agent invalid !');
    }

    if (!request.headers[HeaderNames.DEVICE_ID]) {
      throw new Error('no client id sent');
    }

    const user: UserEntity = await this._authService.loginAndValidate({ email, password });

    if (!user) throw new NotFoundException('user not found');
    if (!user.isActive || !user.isVerified) throw new BadRequestException('User not active yet');

    return user;
  }
}
