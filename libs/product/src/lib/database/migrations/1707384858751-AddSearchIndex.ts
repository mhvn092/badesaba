import { MigrationInterface, QueryRunner } from 'typeorm';
import { BookEntity } from '../entities/book/book.entity';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';

export class AddSearchIndex1707384858751 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {

        await queryRunner.createCollectionIndex('book', {
            name: 'text',
            'author.name': 'text',
            'category.name': 'text'
        })
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
   // not needed 
  }
}
