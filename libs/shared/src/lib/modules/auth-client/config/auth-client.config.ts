import { IsNotEmpty, IsString } from 'class-validator';
import { registerConfig } from '../../../utils';

enum AUTH_CLIENT_CONFIG {
  AUTH_GRPC_URL = 'AUTH_GRPC_URL',
}

export class AuthClientConfig {
  constructor(obj: Partial<AuthClientConfig>) {
    Object.assign(this, obj);
  }

  @IsString()
  @IsNotEmpty()
  authGrpcUrl = '';
}

export const authClientConfig = registerConfig(AuthClientConfig, () => {
  return new AuthClientConfig({
    authGrpcUrl: process.env[AUTH_CLIENT_CONFIG.AUTH_GRPC_URL],
  });
});
