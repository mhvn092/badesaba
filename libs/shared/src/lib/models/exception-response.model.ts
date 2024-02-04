import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResponseModel {
  @ApiProperty()
  statusCode: number;

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  message: string | string[];

  @ApiProperty()
  timestamp: string;
}
