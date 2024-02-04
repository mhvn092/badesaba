import { DynamicModule, Module } from '@nestjs/common';
import { AxiosService } from './services/axios.service';
import { AXIOS_TOKEN, HTTP_AXIOS_TOKEN } from './constansts/tokens.constant';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { HttpAxiosService } from './services/http-axios.service';

const providers: Array<Provider<AxiosService | HttpAxiosService>> = [
  {
    provide: AXIOS_TOKEN,
    useClass: AxiosService,
  }
];
@Module({})
export class RequesterModule {
  private static readonly _dynamicModule: DynamicModule = {
    module: RequesterModule,
    providers: [],
    exports: [],
  };

  static register(): DynamicModule {
    RequesterModule._dynamicModule.providers = providers;
    RequesterModule._dynamicModule.exports = providers;
    return RequesterModule._dynamicModule;
  }
}
