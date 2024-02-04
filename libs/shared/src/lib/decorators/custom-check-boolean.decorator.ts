import { applyDecorators } from '@nestjs/common';
import { IsBoolean } from 'class-validator';
import { booleanTransform, getOptionalDecorators } from '../utils';
import { Column } from 'typeorm';
import { Transform } from 'class-transformer';

export function CheckBoolean(
  nullable = false,
  forEntity = true,
  defaultValue = false
) {
  const decorators: Array<PropertyDecorator> = [
    IsBoolean(),
    Transform((param) => booleanTransform(param)),
    ...getOptionalDecorators(nullable),
    ...(forEntity ? [Column({ nullable, default: defaultValue })] : []),
  ];

  return applyDecorators(...decorators);
}
