import { ApiProperty, PickType } from '@nestjs/swagger';
import { ARGContractEntity } from '../../../database/entities/accounting/contract/contract.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateARGContractDto extends PickType(ARGContractEntity, [
  'planDurationId',
  'sectionId',
  'description',
]) {}

export class RejectARGContractDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Reason for change of the status',
    example: 'No money in account!',
  })
  @IsString()
  reason: string;
}
