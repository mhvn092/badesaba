import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

export class GrpcClient {
  private client: ClientGrpc = null;

  public createClient(url: string): ClientGrpc {
    return this.client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: url,
        protoPath: join(__dirname, 'assets-shared/authorize.proto'),
        package: 'authorize',
      },
    });
  }
}
