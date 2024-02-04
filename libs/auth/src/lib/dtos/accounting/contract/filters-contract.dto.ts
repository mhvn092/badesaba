import { ApiPropertyOptional, OmitType, PickType } from '@nestjs/swagger';
import { uuid } from '@spad/shared/common';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { FindOperator } from 'typeorm';
import { booleanTransform } from '@spad/backend/shared';

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
  dueDate?: FindOperator<Date>;

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

export class FilterARGContractsBaseDto extends PickType(ARGGetAllFiltersBaseDto, [
  'customerId',

  'dateFrom',
  'dateTo',
  'expireDate',

  'priceFrom',
  'priceTo',
  'totalPrice',

  'term',
] as const) {
  @IsOptional()
  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @Transform((params) => booleanTransform(params))
  isExpired?: boolean;

  @IsOptional()
  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @Transform((params) => booleanTransform(params))
  isPublished?: boolean;

  @IsOptional()
  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @Transform((params) => booleanTransform(params))
  isFullyPaid?: boolean;

  // @IsOptional()
  // @ApiPropertyOptional({
  //   enum: ContractStatusEnum,
  // })
  // @IsEnum(ContractStatusEnum)
  // status?: ContractStatusEnum;
}

export class FilterARGContractDto extends FilterARGContractsBaseDto {
  @IsOptional()
  @ApiPropertyOptional({ format: 'uuid', type: String })
  adId?: string;

  @IsOptional()
  @ApiPropertyOptional({ format: 'uuid', type: String })
  @IsUUID()
  cityId?: uuid;

  @IsOptional()
  @ApiPropertyOptional({ format: 'uuid', type: String })
  @IsUUID()
  jobId?: uuid;

  @IsOptional()
  @ApiPropertyOptional({ format: 'uuid', type: String })
  @IsUUID()
  sectionId?: uuid;
}

export class FilterARGContractCompanyDto extends OmitType(FilterARGContractDto, [
  'customerId',
] as const) {}

export class FilterAllARGContractsOfCompanyDto {
  @ApiPropertyOptional({ format: 'uuid', type: String })
  @IsOptional()
  @IsUUID()
  customerId?: uuid;

  @ApiPropertyOptional({ format: 'uuid', type: String })
  @IsOptional()
  @IsUUID()
  adId?: uuid;
}
