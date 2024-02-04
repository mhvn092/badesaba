import { applyDecorators } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { getOptionalDecorators } from '../utils';
import { Column } from 'typeorm';

export function CheckNumber(nullable = false, forEntity = true) {
  const decorators: Array<PropertyDecorator> = [
    IsNumber(),
    ...getOptionalDecorators(nullable),
    ...(forEntity ? [Column({ nullable })] : []),
  ];

  return applyDecorators(...decorators);
}
