import { IsNotEmpty, IsString } from 'class-validator';
import { registerConfig } from '../../../utils/register.config';

enum PRODUCT_CLIENT_CONFIG {
  PRODUCT_GRPC_URL = 'PRODUCT_GRPC_URL',
}

export class ProductClientConfig {
  constructor(obj: Partial<ProductClientConfig>) {
    Object.assign(this, obj);
  }

  @IsString()
  @IsNotEmpty()
  productGrpcUrl = '';
}

export const productClientConfig = registerConfig(ProductClientConfig, () => {
  return new ProductClientConfig({
    productGrpcUrl: process.env[PRODUCT_CLIENT_CONFIG.PRODUCT_GRPC_URL],
  });
});
