import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  AuthClientConfig,
  authClientConfig,
} from './config/auth-client.config';
import { AuthClientService } from './services/auth-client.service';
import { ApiAccessStrategy } from './strategies/access.strategy';
import { AUTH_GRPC_CLIENT_TOKEN } from './constants/auth-grpc-client-token.constant';
import { RpcPackageEnum } from '../../enums';

@Module({
  imports: [
    ConfigModule.forFeature(authClientConfig),
    ClientsModule.registerAsync([
      {
        name: AUTH_GRPC_CLIENT_TOKEN,
        imports: [ConfigModule.forFeature(authClientConfig)],
        useFactory: (authClientConfig: AuthClientConfig) => ({
          transport: Transport.GRPC,
          options: {
            package: RpcPackageEnum.Auth,
            url: authClientConfig.authGrpcUrl,
            protoPath: join(__dirname, 'assets-shared/auth.proto'),
          },
        }),
        inject: [authClientConfig.KEY],
      },
    ]),
  ],
  providers: [AuthClientService, ApiAccessStrategy],
  exports: [ApiAccessStrategy],
})
export class AuthClientModule {}
