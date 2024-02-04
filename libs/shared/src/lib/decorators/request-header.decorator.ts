import {
  createParamDecorator,
  ExecutionContext,
  PreconditionFailedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const RequestHeader = createParamDecorator(async (value: any, ctx: ExecutionContext) => {
  const headers = ctx.switchToHttp().getRequest().headers;
  const dto = plainToInstance(value, headers, { excludeExtraneousValues: true });
  return validateOrReject(dto).then(
    () => {
      return dto;
    },
    () => {
      throw new PreconditionFailedException('missing headers');
    },
  );
});
