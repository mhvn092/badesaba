import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsDate, IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import {
  CreateDateColumn,
  DeleteDateColumn,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export class SharedBaseEntity {
  @ObjectIdColumn({ primary: true, generated: true })
  @ApiProperty({type:'string'})
  @IsMongoId()
  @Transform((res) => {
    const key = res?.obj[res?.key]
    if(res?.obj[res?.key]){
      return key?.toString()
    }
    return (res.value as ObjectId).toString()})
  _id: ObjectId;

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @ApiProperty()
  @IsDate()
  updated_at: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
