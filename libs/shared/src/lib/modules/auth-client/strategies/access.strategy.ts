import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  UserAccessInterface,
} from '../../../interfaces';
import { AuthClientService } from '../services/auth-client.service';
import { HeaderNames } from '../../../enums';


@Injectable()
export class ApiAccessStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(private readonly _authClientService: AuthClientService) {
    super();
  }

  async validate(request: any): Promise<UserAccessInterface> {
    console.debug('Custom validation ' + request.headers['authorization']);

    const headersRequest = {
      Authorization: request.headers['authorization'],
    };

    if (!headersRequest.Authorization) {
      throw new UnauthorizedException();
    }

    try {
      // gRPC Request
      const user  = await this._authClientService.authorize({ token: headersRequest.Authorization });
      // put the user in the request to be able to use it
      request[HeaderNames.USER] = user;
      return user;
    } catch (err) {
      console.error(err.message, err.stack, 'ApiAccessStrategy');
      console.log(err, 'ApiAccessStrategy');

      throw new UnauthorizedException();
    }
  }
}
