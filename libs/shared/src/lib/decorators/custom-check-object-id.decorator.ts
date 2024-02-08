import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { ObjectId, ObjectIdColumn } from 'typeorm';
import { getOptionalDecorators } from '../utils';

export function CheckObjectId(
  name: string,
  nullable = false,
  forEntity = true,
) {
  const decorators: Array<PropertyDecorator> = [
    IsMongoId(),
    ...getOptionalDecorators(nullable, 'string'),
    ...(forEntity ? [ObjectIdColumn({ nullable, name })] : []),
    Transform((value) => (value.value as ObjectId).toString()),
  ];

  return applyDecorators(...decorators);
}
