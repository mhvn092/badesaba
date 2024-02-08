import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { RpcPackageEnum } from '../../enums/rpc-package-name.enum';
import { ProductClientConfig, productClientConfig } from './config/product-client.config';
import { PRODUCT_GRPC_CLIENT_TOKEN } from './constants/product-grpc-client-token.constant';
import { ProductClientService } from './services/product-client.service';

@Module({
  imports: [
    ConfigModule.forFeature(productClientConfig),
    ClientsModule.registerAsync([
      {
        name: PRODUCT_GRPC_CLIENT_TOKEN,
        imports: [ConfigModule.forFeature(productClientConfig)],
        useFactory: (productClientConfig: ProductClientConfig) => ({
          transport: Transport.GRPC,
          options: {
            package: RpcPackageEnum.Product,
            url: productClientConfig.productGrpcUrl,
            protoPath: join(__dirname, 'assets-shared/product.proto'),
          },
        }),
        inject: [productClientConfig.KEY],
      },
    ]),
  ],
  providers: [ProductClientService],
  exports: [ProductClientService],
})
export class ProductClientModule {}
