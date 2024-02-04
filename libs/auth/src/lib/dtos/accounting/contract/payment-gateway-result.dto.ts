import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaymentGatewayResultDto {
  @ApiPropertyOptional({
    format: 'uuid',
    type: String,
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  gateway?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  errorMessage?: string;

  constructor(data: Partial<PaymentGatewayResultDto>) {
    Object.assign(this, data);
  }
}
