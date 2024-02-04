import { applyDecorators } from '@nestjs/common';
import { IsEnum } from 'class-validator';
import { getOptionalDecorators } from '../utils';
import { Column } from 'typeorm';

export function CheckEnum(
  enumType: Object,
  nullable = false,
  forEntity = true,
  defaultValue?: string
) {
  const decorators: Array<PropertyDecorator> = [
    IsEnum(enumType),
    ...getOptionalDecorators(nullable, 'enum', enumType),
    ...(forEntity
      ? [
          Column({
            nullable,
            enum: enumType,
            ...(defaultValue && { default: defaultValue }),
          }),
        ]
      : []),
  ];

  return applyDecorators(...decorators);
}
