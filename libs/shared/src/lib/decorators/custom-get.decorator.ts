import { applyDecorators, Get, Type } from '@nestjs/common';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { SharedCustomRouteInfoDto } from '../dtos';
import { ApiFilterQuery } from './api-filter-query';
import { getSharedDecorators } from '../utils/get-shared-decorators';

export type ApiCustomParamOption = { enum: SwaggerEnumType };

export function GetInfo(
  path: string,
  paramNames: string[] | Record<string, ApiCustomParamOption>,
  info: SharedCustomRouteInfoDto,
  queryName?: string,
  queryType?: Type<unknown>,
) {
  const decorators: Array< MethodDecorator | PropertyDecorator> = [
    Get(path),
  ];

  decorators.push(...getSharedDecorators(path, info, paramNames));

  if (queryName) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    decorators.push(ApiFilterQuery(queryName, queryType as Function));
  }
  return applyDecorators(...decorators);
}
