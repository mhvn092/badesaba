import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '@lib/shared';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly _jwtConfigService: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _jwtConfigService.jwtAccessTokenSecret,
    });
  }

  validate(payload: { id: string; email: string }): { id: string; email: string } {
    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
