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

@Module({
  imports: [
    ConfigModule.forFeature(authClientConfig),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_GRPC_CLIENT',
        imports: [ConfigModule.forFeature(authClientConfig)],
        useFactory: (authClientConfig: AuthClientConfig) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
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
