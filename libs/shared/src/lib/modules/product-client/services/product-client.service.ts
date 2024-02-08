import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RpcServicesEnum } from '../../../enums/rpc-services.enum';
import { PRODUCT_GRPC_CLIENT_TOKEN } from '../constants/product-grpc-client-token.constant';
import {
  GetAvailabilityRequestInterface,
  GetAvailabilityResponseInterface,
  ProductServiceInterface,
  ReduceAvailibilityRequestInterface,
  ReduceAvailibilityResponseInterface
} from '../../../interfaces/product.service.interface';

@Injectable()
export class ProductClientService {
  private readonly _productService: ProductServiceInterface;

  constructor(
    @Inject(PRODUCT_GRPC_CLIENT_TOKEN) private _productClient: ClientGrpc
  ) {
    this._productService =
      this._productClient.getService<ProductServiceInterface>(
        RpcServicesEnum.ProductService
      );
  }

  GetAvailability(body: GetAvailabilityRequestInterface): Promise<GetAvailabilityResponseInterface[]> {
    const observable = this._productService.GetAvailability(body);
    return firstValueFrom(observable);
  }

  ReduceAvailability(body: ReduceAvailibilityRequestInterface[]): Promise<ReduceAvailibilityResponseInterface> {
    const observable = this._productService.ReduceAvailability(body);
    return firstValueFrom(observable);
  }
}
