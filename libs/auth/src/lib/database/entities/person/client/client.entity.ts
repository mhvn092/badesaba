import { SharedBaseEntity } from '@lib/shared';
import { Column, Entity, Unique } from 'typeorm';

@Entity({
  name: 'clients',
})
@Unique('client_refresh_token_client_user_unique', ['refreshToken', 'userId', 'clientId'])
export class ClientEntity extends SharedBaseEntity {
  @Column({ nullable: true })
  refreshToken?: string;

  @Column()
  userId: string;

  @Column()
  clientId: string;

  @Column()
  expiry: Date;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  userAgent: string;
}
