import { RedisHelperModule } from '@lib/shared/modules/redis-helper';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity, BookRepository } from 'libs/product/src/lib/database/entities/book';
import { AuthorModule } from '../author/author.module';
import { CategoryModule } from '../category/category.module';
import { BookAdminController } from './book.admin.controller';
import { BookPublicController } from './book.public.controller';
import { BookService } from './book.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    RedisHelperModule,
    AuthorModule,
    CategoryModule,
  ],
  controllers: [BookAdminController, BookPublicController],
  providers: [BookRepository, BookService],
})
export class BookModule {}
