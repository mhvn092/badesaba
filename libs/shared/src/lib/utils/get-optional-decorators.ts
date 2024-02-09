import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export function getOptionalDecorators(
  optional: boolean,
  type?: any,
  enumType?: Object
): Array<PropertyDecorator> {
  return optional
    ? [ApiPropertyOptional({ type, enum: enumType }), IsOptional()]
    : [ApiProperty({ type, enum: enumType }), IsNotEmpty()];
}
