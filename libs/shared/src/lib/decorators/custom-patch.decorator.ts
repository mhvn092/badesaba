import { applyDecorators, Patch, SetMetadata, Type } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { ApiCustomParamOption } from './custom-get.decorator';
import { SharedUpdateRouteInfoDto } from '../dtos';
import { getSharedDecorators } from '../utils/get-shared-decorators';

export function PatchInfo(
  path: string,
  paramNames: string[] | Record<string, ApiCustomParamOption>,
  inputType: Type<unknown> | ClassConstructor<any>,
  inputIsArray = false,
  info: SharedUpdateRouteInfoDto,
) {
  const decorators: Array<MethodDecorator | PropertyDecorator> = [
    Patch(path),
  ];

  if (inputType) {
    decorators.push(ApiBody({ type: () => inputType, isArray: inputIsArray }));
  }

  decorators.push(...getSharedDecorators(path, info, paramNames));

  return applyDecorators(...decorators);
}
