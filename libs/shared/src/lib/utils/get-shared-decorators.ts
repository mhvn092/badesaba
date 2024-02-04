import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HttpCode } from '@nestjs/common';
import { SharedCustomRouteInfoDto, SharedUpdateRouteInfoDto } from '../dtos';
import { applyRouteParams } from '../utils';
import { ApiCustomParamOption } from '../decorators';

export function getSharedDecorators(
  path: string,
  info: SharedUpdateRouteInfoDto | SharedCustomRouteInfoDto,
  paramNames?: string[] | Record<string, ApiCustomParamOption>,
): Array<ClassDecorator | MethodDecorator | PropertyDecorator> {
  const { outputType, outputIsArray, ...args } = info;
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    ApiOperation({
      ...args,
    }),
  ];
  if (paramNames) {
    decorators.push(...applyRouteParams(path, paramNames));
  }
  if (outputType) {
    decorators.push(ApiOkResponse({ type: () => outputType, isArray: outputIsArray }));
  } else {
    decorators.push(HttpCode(204));
  }
  return decorators;
}
