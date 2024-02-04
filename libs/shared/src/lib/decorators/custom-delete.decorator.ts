import { applyDecorators, Delete, SetMetadata } from '@nestjs/common';
import { SharedUpdateRouteInfoDto } from '../dtos';
import { getSharedDecorators } from '../utils/get-shared-decorators';

export function DeleteInfo(path: string, paramName: string[], info: SharedUpdateRouteInfoDto) {
  const decorators: Array<MethodDecorator | PropertyDecorator> = [
    Delete(path),
  ];
  decorators.push(...getSharedDecorators(path, info, paramName));

  return applyDecorators(...decorators);
}
