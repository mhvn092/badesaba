import { CategoryEntity, CategoryRepository } from '@lib/product/entities';
import { RedisHelperModule } from '@lib/shared/modules/redis-helper';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorAdminController } from './author.admin.controller';
import { AuthorPublicController } from './author.public.controller';
import { AuthorService } from './author.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), RedisHelperModule],
  controllers: [AuthorAdminController,AuthorPublicController],
  providers: [
    CategoryRepository,
    AuthorService
  ],
})
export class CategoryModule {}
