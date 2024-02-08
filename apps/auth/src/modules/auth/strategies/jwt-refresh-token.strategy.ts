import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PersonService } from '../../person/person.service';
import { AuthService } from '../auth.service';
import { HeaderNames, Payload } from '@lib/shared';
import { ClientEntity } from '@lib/auth/entities';
import { JwtConfig, jwtConfig } from '@lib/auth';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(jwtConfig.KEY) private readonly _jwtConfigService: JwtConfig,
    private readonly _authService: AuthService,
    private readonly _personService: PersonService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _jwtConfigService.jwtRefreshTokenSecret,
      passReqToCallback: true,
      /*
       * we want to remove the users refresh token and also kick him out in the front,
       * so we handle it our self
       */
      ignoreExpiration: true,
    });
  }

  async validate(request: Request, payload: Payload): Promise<Partial<{ Payload; refreshToken }>> {
    let user;
    const refreshToken: string = request
      .get(HeaderNames.AUTHORIZATION)
      .replace('Bearer', '')
      .trim();
    try {
      user = await this._personService.getProfile(payload._id);
      console.debug({
        message: `user retrieved with payload.id of ${payload._id}`,
        payload,
        user,
      });
    } catch (e) {
      /**
       * because the exception that strategy throws should of 401 status
       **/
      console.debug('user not found');
      throw new UnauthorizedException();
    }

    const clientId: string = request.header(HeaderNames.DEVICE_ID);
    const client: ClientEntity = await this._personService.findClient(user.id, clientId);
    if (!client) {
      console.debug(`User client with clientId: ${clientId} not found`);
      throw new UnauthorizedException();
    }

    console.debug({
      message: 'client object',
      headerRefreshToken: refreshToken,
      client,
    });

    /*
     * if refresh token is invalid we should delete it and then throw the unauthorized exception
     */
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      await this._personService.removeRefreshToken(payload._id);
      throw new UnauthorizedException();
    }

    if (this._authService.compareRefreshTokens(refreshToken, client.refreshToken)) {
      /*
       * inorder to access within @Req
       * like: req.user.client
       * */
      user.client = client;

      console.debug('User found and passes successfully');
      return user;
    }

    console.debug('User can not validated, see logs above');
    return null;
  }
}
