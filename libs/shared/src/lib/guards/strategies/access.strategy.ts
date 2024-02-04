import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AuthorizationServiceInterface,
  UserAccessInterface,
} from '../../interfaces';
import { GrpcClient } from '../../classes/grpc-client';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ApiAccessStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor() {
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
      const client = new GrpcClient().createClient('app.authUrl');
      const observable = client
        .getService<AuthorizationServiceInterface>('AuthorizationService')
        .authorize({ token: headersRequest.Authorization });
      const user  = await firstValueFrom(observable)
      user.type = user.type;
      return user;
    } catch (err) {
      console.error(err.message, err.stack, 'ApiAccessStrategy');
      console.log(err, 'ApiAccessStrategy');

      const code = err.metadata.get('code').pop() as string;
      // if (+code === ExceptionCodes.TOKEN_EXPIRED) {
      //   throw new TokenExpiredException();
      // }

      throw new UnauthorizedException();
    }
  }
}
