import { PickType } from '@nestjs/swagger';
import { FilterARGContractDto } from '../contract/filters-contract.dto';

// import { GetAllARGFiltersBaseDto } from '../common';

class PaymentFiltersFromAdContractFiltersDto extends PickType(FilterARGContractDto, [
  'cityId',
  'jobId',
  'sectionId',
] as const) {}

// export class ARGFilterPaymentDto extends IntersectionType(
//   PaymentFiltersFromAllFiltersBaseDto,
//   PaymentFiltersFromAdContractFiltersDto,
// ) {
//
//   @IsOptional()
//   @ApiPropertyOptional({ example: false })
//   @IsBoolean()
//   @Transform((params) => booleanTransform(params))
//   isCleared?: boolean;
//
//   @IsOptional()
//   @ApiPropertyOptional({
//     enum: PaymentStatusEnum,
//   })
//   @IsEnum(PaymentStatusEnum)
//   status?: PaymentStatusEnum;
// }

// export class FilterPaymentEmployeeDto extends OmitType(FilterPaymentDto, ['employeeId'] as const) {}

// export class FilterPaymentCompanyDto extends OmitType(FilterPaymentDto, [
//   'employeeId',
//   'customerId',
// ] as const) {}
