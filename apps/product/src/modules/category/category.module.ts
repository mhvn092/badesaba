import { CategoryEntity, CategoryRepository } from '@lib/product/entities';
import { RedisHelperModule } from '@lib/shared/modules/redis-helper';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryAdminController } from './category.admin.controller';
import { CategoryPublicController } from './category.public.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), RedisHelperModule],
  controllers: [CategoryAdminController,CategoryPublicController],
  providers: [
    CategoryRepository,
    CategoryService
  ],
})
export class CategoryModule {}
