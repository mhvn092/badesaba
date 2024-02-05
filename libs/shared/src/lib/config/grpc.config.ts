import { CheckNumber } from '../decorators';
import { registerConfig } from '../utils/register.config';

export enum GRPC_CONFIG {
  GRPC_PORT = 'GRPC_PORT',
}

export class GrpcConfig {
  constructor(obj: Partial<GrpcConfig>) {
    Object.assign(this, obj);
  }

  @CheckNumber(false, false)
  grpcPort: number;
}

export const grpcConfig = registerConfig(GrpcConfig, () => {
  const port = process.env[GRPC_CONFIG.GRPC_PORT];
  return new GrpcConfig({
    grpcPort: port ? +port : undefined,
  });
});
