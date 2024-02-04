import {
  ApiCustomParamOption,
  ApiFilterQuery,
  ApiPaginatedResponse,
  ApiQueryOrder,
  ApiQueryPagination,
} from '../decorators';
import { applyDecorators, Get, Type } from '@nestjs/common';
import { ExternalDocumentationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyRouteParams } from '../utils';

/**
 *
 * @param path
 * @param info
 * @param paginationEntityResponse
 * @param queryName
 * @param queryType
 * @param paramNames
 * @param overrideResponse
 **/
export function GetWithPaginationInfo(
  path: string,
  info: {
    summary: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
  },
  paginationEntityResponse: Type<any>,
  queryName?: string,
  queryType?: Type<unknown>,
  paramNames?: string[] | Record<string, ApiCustomParamOption>,
  overrideResponse?: boolean,
) {
  const decorators: Array<MethodDecorator | PropertyDecorator> = [
    Get(path !== '/' && path !== '' ? `/paginated/${path}` : 'paginated'),
  ];
  decorators.push(
    ApiQueryOrder(),
    ApiQueryPagination(),
    ApiOperation({
      ...info,
    }),
  );
  if (overrideResponse) {
    decorators.push(
      ApiOkResponse({
        type: () => paginationEntityResponse,
      }),
    );
  } else {
    decorators.push(ApiPaginatedResponse(paginationEntityResponse));
  }
  if (queryName) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    decorators.push(ApiFilterQuery(queryName, queryType as Function));
  }
  if (paramNames && paramNames?.length) {
    decorators.push(...applyRouteParams(path, paramNames));
  }
  return applyDecorators(...decorators);
}
