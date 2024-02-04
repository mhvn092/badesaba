import { applyDecorators } from '@nestjs/common';
import { IsString } from 'class-validator';
import { getOptionalDecorators } from '../utils/get-optional-decorators';
import { Column } from 'typeorm';

export function CheckString(
  nullable = false,
  forEntity = true,
  unique = false
) {
  const decorators: Array<PropertyDecorator> = [
    IsString(),
    ...getOptionalDecorators(nullable),
    ...(forEntity ? [Column({ nullable, unique })] : []),
  ];

  return applyDecorators(...decorators);
}
