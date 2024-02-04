import { Injectable } from '@nestjs/common';
import { DataSource, MongoRepository } from 'typeorm';
import { ClientEntity } from './client.entity';
import { objectId } from '@lib/shared';

@Injectable()
export class ClientRepository extends MongoRepository<ClientEntity> {
  constructor(private _dataSource: DataSource) {
    super(ClientEntity, _dataSource.createEntityManager());
  }

  getAll(conditions?: Partial<Record<keyof ClientEntity, any>>): Promise<ClientEntity[]> {
    return this.find({
      where: { ...(conditions && { ...conditions }) },
      order: { created_at: 'DESC' },
    });
  }

  getOne(id: string, conditions?: Partial<Record<keyof ClientEntity, any>>): Promise<ClientEntity> {
    return this.findOne({ where: { id, ...(conditions && { ...conditions }) } });
  }

  getClientEachUser(userId: objectId, clientId: string): Promise<ClientEntity> {
    return this.findOne({ where: { userId, clientId } });
  }

  add(data: Partial<ClientEntity>): Promise<ClientEntity> {
    const newClient: ClientEntity = this.create(data);
    return this.save(newClient);
  }

  async removeRefreshToken(id: objectId): Promise<void> {
    await this.update(id, { refreshToken: null });
  }
}
