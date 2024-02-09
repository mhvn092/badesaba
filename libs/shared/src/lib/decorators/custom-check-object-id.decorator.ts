import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { ObjectIdColumn } from 'typeorm';
import { getOptionalDecorators } from '../utils';
import { ObjectId } from 'mongodb';

export function CheckObjectId(
  name: string,
  nullable = false,
  forEntity = true,
  unique = false
) {
  const decorators: Array<PropertyDecorator> = [
    IsMongoId(),
    // Type(() => ObjectId),
    ...getOptionalDecorators(nullable, 'string'),
    ...(forEntity ? [ObjectIdColumn({ nullable, name, unique })] : []),
    Transform((res) => {
      const key = res?.obj[res?.key]
      if(res?.obj[res?.key]){
        return key?.toString()
      }
      return (res.value as ObjectId).toString()}),
  ];

  return applyDecorators(...decorators);
}
