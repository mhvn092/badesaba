import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GrpcRequest = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    return ctx.switchToRpc().getData();
  },
);
