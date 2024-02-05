import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtConfig, Payload, jwtConfig } from '@lib/shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private readonly _jwtConfigService: JwtConfig,
  ) {
    console.log('opiuoqiwe',_jwtConfigService)
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('access_token'),
      ]),
      ignoreExpiration: true,
      secretOrKey: _jwtConfigService.jwtAccessTokenSecret,
    } as StrategyOptions);
  }

  async validate(payload: Payload): Promise<Payload> {
    /*
     * if token is malformed or invalid it will be rejected before reaching this method
     * but we ignored expiration check in constructor above
     * because we want to throw custom exception on token expiration
     * */
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('توکن منقضی شده است');
    }

    /*
     * for better performance we skipped database query here
     * because all required user information is embed in jwt payload
     * more importantly it reduces our dependency on person module
     * */
    const user: Payload = payload;
    if (!user || !user?.isActive) {
      throw new UnauthorizedException();
    }
    return user;
  }
}