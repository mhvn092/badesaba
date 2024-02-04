import { ApiPropertyOptional } from '@nestjs/swagger';
import { uuid } from '@spad/shared/common';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { FindOperator } from 'typeorm';

export class ARGGetAllFiltersBaseDto {
  @IsOptional()
  @ApiPropertyOptional({ format: 'uuid', type: String })
  @IsUUID()
  customerId?: uuid;

  // ? Date fields
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date;

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @Type(() => Date)
  dateTo?: Date;

  // * Just for Installments
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @Type(() => Date)
  paidDateFrom?: Date;

  // * Just for Installments
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @Type(() => Date)
  paidDateTo?: Date;

  // * Just for Installments
  @IsOptional()
  paidDate?: FindOperator<Date>;

  // * For AccountBalance & EmployeeCommission
  @IsOptional()
  created_at?: FindOperator<Date>;

  // * For Contracts
  @IsOptional()
  expireDate?: FindOperator<Date>;

  // ? Price fields
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @Type(() => Number)
  priceFrom?: number;

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @Type(() => Number)
  priceTo?: number;

  // * For Installment & AccountBalance & EmployeeCommission
  @IsOptional()
  @IsNumber()
  price?: FindOperator<number>;

  // * Every entity except the fields above
  @IsOptional()
  @IsInt()
  totalPrice?: FindOperator<number>;

  // * Search
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  term?: string;

  // * Just for search
  @IsOptional()
  ad?: { title: FindOperator<string> };
  @IsOptional()
  contract?: { ad: { title: FindOperator<string> } };
}
