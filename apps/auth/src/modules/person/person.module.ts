import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonAdminController } from './person.admin.controller';
import { PersonController } from './person.base.controller';
import { PersonService } from './person.service';
import {
  ClientEntity,
  ClientRepository,
  UserEntity,
  UserRepository,
} from '@lib/auth/entities';
import { bcryptConfig } from '@lib/shared/config/bcrypt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ClientEntity]),
    ConfigModule.forFeature(bcryptConfig),
  ],
  controllers: [PersonController, PersonAdminController],
  providers: [PersonService, UserRepository, ClientRepository],
  exports: [PersonService],
})
export class PersonModule {}
