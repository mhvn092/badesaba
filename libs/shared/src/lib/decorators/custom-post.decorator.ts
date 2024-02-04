import { applyDecorators, Post, SetMetadata, Type } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { SharedCustomRouteInfoDto } from '../dtos';
import { getSharedDecorators } from '../utils/get-shared-decorators';

export function PostInfo(
  path: string,
  inputType: Type<unknown> | ClassConstructor<any>,
  inputIsArray = false,
  info: SharedCustomRouteInfoDto,
  paramNames?: string[],
) {
  const decorators: Array< MethodDecorator | PropertyDecorator> = [
    Post(path),
  ];

  if (inputType) {
    decorators.push(ApiBody({ type: () => inputType, isArray: inputIsArray }));
  }
  decorators.push(...getSharedDecorators(path, info, paramNames));

  return applyDecorators(...decorators);
}
