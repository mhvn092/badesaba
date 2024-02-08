import {
  GrpcRequest,
  ModulesEnum,
  RouteTypeEnum,
  RpcMethodsEnum,
  RpcServicesEnum,
  SharedControllerInfo,
  GetAvailabilityRequestInterface,
  GetAvailabilityResponseInterface,
  ReduceAvailibilityRequestInterface,
  ReduceAvailibilityResponseInterface,
} from '@lib/shared';
import { GrpcMethod } from '@nestjs/microservices';
import { BookService } from './book.service';

@SharedControllerInfo(ModulesEnum.Book, 'auth', RouteTypeEnum.PUBLIC)
export class BookRpcController {
  constructor(private readonly _bookService: BookService) {}

  @GrpcMethod(RpcServicesEnum.ProductService, RpcMethodsEnum.GetAvailability)
  async getAvailibilites(
    @GrpcRequest() request: GetAvailabilityRequestInterface
  ): Promise<GetAvailabilityResponseInterface[]> {
    return this._bookService.getAvailabilities(request);
  }

  @GrpcMethod(RpcServicesEnum.ProductService, RpcMethodsEnum.GetAvailability)
  async reduceAvailibilites(
    @GrpcRequest() request: ReduceAvailibilityRequestInterface[]
  ): Promise<ReduceAvailibilityResponseInterface> {
    return this._bookService.reduceAvailabilities(request);
  }
}
