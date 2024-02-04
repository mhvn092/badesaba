import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

/**
 * this decorator adds swagger api header for all the keys you provided
 * @param headers a record of header name and its requirement
 * @constructor
 */
export function SetHeaders(headers: Record<string, boolean>) {
  const decorators: any[] = [];
  Object.keys(headers).map((_item) => {
    decorators.push(ApiHeader({ name: _item, required: headers[_item] }));
  });
  return applyDecorators(...decorators);
}
