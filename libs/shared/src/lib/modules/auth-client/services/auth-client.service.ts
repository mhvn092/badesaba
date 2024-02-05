import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AuthorizationServiceInterface,
  BodyAuthorizeInterface,
  ResponseAuthorizeInterface,
} from '../interfaces/auth.service.interface';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class AuthClientService {

  private readonly _authService: AuthorizationServiceInterface;

  constructor(@Inject('AUTH_GRPC_CLIENT') private _authClient: ClientGrpc) {
    this._authService = this._authClient.getService<AuthorizationServiceInterface>('AuthService');
  }

  authorize(body: BodyAuthorizeInterface): Promise<ResponseAuthorizeInterface> {
    const observable = this._authService.authorize(body);
    return firstValueFrom(observable)
  }
}
