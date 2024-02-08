import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';

export class CreateUniqueIndices1707390050467 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    await queryRunner.createCollectionIndex(
      'user',
      { email: 1 }, 
      { unique: true }
    );

    await queryRunner.createCollectionIndex(
      'clients',
      { refreshToken: 1, userId: 1, clientId: 1 },
      { unique: true }
    );
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {}
}
