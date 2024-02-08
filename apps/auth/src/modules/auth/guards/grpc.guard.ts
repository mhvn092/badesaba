import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PersonService } from '../../person/person.service';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GrpcGuard implements CanActivate {

  constructor(
    private _personService: PersonService,
    private _jwtService: JwtService,
  ) {
  }

  async canActivate(context: ExecutionContext) {
    const data = context.switchToRpc().getData();
    if (!data.token) {
      throw new RpcException('UnAuthorized');
    }
    const token = data.token.slice(data.token.indexOf(' ') + 1);
    const metadata = context.switchToRpc().getContext();

    const userValid = this._jwtService.verify(token, {
      ignoreExpiration: true, // set this to true, because we want to manually sent TokenExpiration
    });

    if (userValid.exp < Math.floor(Date.now() / 1000)) {
      throw new RpcException('Token Expired');
    }
    metadata.add('userId', userValid._id + '');

    return true;
  }


}
