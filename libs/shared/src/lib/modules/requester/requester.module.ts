import { DynamicModule, Module } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { AXIOS_TOKEN } from './constansts/tokens.constant';
import { AxiosService } from './services/axios.service';

const providers: Array<Provider<AxiosService>> = [
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
