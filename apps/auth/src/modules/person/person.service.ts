import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import {
  ClientEntity,
  ClientRepository,
  UserEntity,
  UserRepository,
} from '@lib/auth/entities';
import {
  BadgeEnum,
  BcryptConfig,
  OrderDto,
  PaginationDto,
  bcryptConfig,
  objectId,
} from '@lib/shared';
import {
  RegisterDto,
  SearchFilters,
  UpdatePasswordDto,
  UpdateProfileDto,
} from '@lib/auth';

@Injectable()
export class PersonService {
  constructor(
    @Inject(bcryptConfig.KEY)
    private readonly _bcryptConfigService: BcryptConfig,
    private readonly _userRepository: UserRepository,
    private readonly _clientRepository: ClientRepository
  ) {}

  getAll(
    conditions?: Partial<Record<keyof UserEntity, any>>
  ): Promise<UserEntity[]> {
    return this._userRepository.getAll(conditions);
  }

  async getAllWithPagination(
    pagination: PaginationDto,
    order: OrderDto,
    filters: SearchFilters
  ): Promise<[UserEntity[], number]> {
    return this._userRepository.getAllWithPaginated(filters, pagination, order);
  }

  getOne(
    id: objectId,
    conditions?: Partial<Record<keyof UserEntity, any>>
  ): Promise<UserEntity> {
    return this._userRepository.getOne(id, conditions);
  }

  async verifyUser(id: objectId): Promise<void> {
    await this._userRepository.update(id, { isVerified: true });
  }

  getProfile(userId: objectId): Promise<UserEntity> {
    return this._userRepository.getProfile(userId);
  }

  async getUserWithEmail(email: string): Promise<UserEntity> {
    return this._userRepository.getByEmail(email);
  }

  async activateUser(id: objectId): Promise<void> {
    const user = await this._userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    await this._userRepository.update(
      { _id: user._id },
      { isActive: !user.isActive }
    );
  }

  async updateProfile(id: objectId, data: UpdateProfileDto): Promise<void> {
    const user = await this._userRepository.findOneBy({
      id,
    });
    if (!user) throw new NotFoundException('user not found');
    await this._userRepository.update(id, data);
  }

  async changePassword(
    userId: objectId,
    data: UpdatePasswordDto
  ): Promise<void> {
    const { password, oldPassword } = data;
    const user: UserEntity = await this._userRepository.getOne(userId);
    if (!user) throw new NotFoundException('user not found');
    const isNewPasswordNotEqual: boolean = await this.comparePassword(
      oldPassword,
      user.password
    );
    if (!isNewPasswordNotEqual)
      throw new Error(
        'your current password should not be equal as your old password'
      );
    const hash: string = await this.hashPassword(password);
    await this.updatePassword(hash, userId);
  }

  async _checkUserExistence(email: string): Promise<boolean> {
    const exists = await this._userRepository.findOne({
      where: {
        email,
      },
    });

    return !!exists;
  }

  createUser(data: RegisterDto): Promise<UserEntity> {
    return this._userRepository.save(data);
  }

  findClient(userId: objectId, clientId?: string): Promise<ClientEntity> {
    return this._clientRepository.getClientEachUser(userId, clientId);
  }

  saveClient(data: Partial<ClientEntity>): Promise<ClientEntity> {
    return this._clientRepository.add(data);
  }

  async updatePassword(
    newHashPassword: string,
    userId: objectId
  ): Promise<void> {
    await this._userRepository.update(userId, { password: newHashPassword });
  }

  async removeRefreshToken(id: objectId): Promise<void> {
    await this._clientRepository.removeRefreshToken(id);
  }

  hashPassword = (password: string) => {
    return hash(password, +this._bcryptConfigService.saltHash);
  };

  comparePassword(password: string, hashPassword: string): Promise<boolean> {
    return compare(password, hashPassword);
  }
}
