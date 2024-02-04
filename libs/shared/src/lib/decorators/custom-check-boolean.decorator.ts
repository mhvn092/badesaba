import { applyDecorators } from '@nestjs/common';
import { IsBoolean } from 'class-validator';
import { getOptionalDecorators } from '../utils';
import { Column } from 'typeorm';

export function CheckBoolean(
  nullable = false,
  forEntity = true,
  defaultValue = false
) {
  const decorators: Array<PropertyDecorator> = [
    IsBoolean(),
    ...getOptionalDecorators(nullable),
    ...(forEntity ? [Column({ nullable, default: defaultValue })] : []),
  ];

  return applyDecorators(...decorators);
}
