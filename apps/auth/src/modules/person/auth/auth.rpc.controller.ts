import { AuthControllerInfo } from '@lib/auth';
import {
  ModulesEnum,
  RouteTypeEnum,
  RpcMethodsEnum,
  RpcServicesEnum,
  UserAccessInterface,
} from '@lib/shared';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { UseGuards } from '@nestjs/common';
import { GrpcGuard } from './guards/grpc.guard';
import { Metadata } from '@grpc/grpc-js';

@AuthControllerInfo(ModulesEnum.Auth, 'auth', RouteTypeEnum.PUBLIC)
export class AuthRpcController {
  constructor(private readonly _authService: AuthService) {}

  @GrpcMethod(RpcServicesEnum.AuthService, RpcMethodsEnum.Authorize)
  @UseGuards(GrpcGuard)
  async getUserAccess(
    request: any,
    metadata: Metadata
  ): Promise<UserAccessInterface> {
    return this._authService.getUserAccess(metadata.get('userId').pop() + '');
  }
}
