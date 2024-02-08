import { AuthorEntity, AuthorRepository, CategoryEntity } from '@lib/product/entities';
import { RedisHelperModule } from '@lib/shared/modules/redis-helper';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookRepository } from 'libs/product/src/lib/database/entities/book';
import { AuthorAdminController } from './author.admin.controller';
import { AuthorPublicController } from './author.public.controller';
import { AuthorService } from './author.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity]), RedisHelperModule],
  controllers: [AuthorAdminController,AuthorPublicController],
  providers: [
    AuthorRepository,
    AuthorService,
    BookRepository,
  ],
  exports:[AuthorService]
})
export class AuthorModule {}
