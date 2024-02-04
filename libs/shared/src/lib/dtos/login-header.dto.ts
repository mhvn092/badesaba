import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class LoginHeaderDto {
  @IsString()
  @IsDefined()
  @Expose({ name: 'x-device-id' })
  @ApiProperty({ name: 'x-device-id' })
  deviceId: string;

  @IsString()
  @IsDefined()
  @Expose({ name: 'user-agent' })
  @ApiProperty({ name: 'user-agent' })
  useragent: string;
}
