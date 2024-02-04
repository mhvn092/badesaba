import { AuthControllerInfo, JwtAuthGuard, UpdatePasswordDto, UpdateProfileDto, User } from '@lib/auth';
import { UserEntity } from '@lib/auth/entities';
import { GetInfo, ModulesEnum, PutInfo, RouteTypeEnum, UserAuthModel } from '@lib/shared';
import { Body, UseGuards } from '@nestjs/common';
import { PersonService } from './person.service';

@AuthControllerInfo(ModulesEnum.Person, 'person', RouteTypeEnum.BASE)
export class PersonController {
  constructor(private readonly _personService: PersonService) {}

  @GetInfo('/profile', null, {
    summary: 'get a user profile',
    outputType: UserEntity,
  })
  @UseGuards(JwtAuthGuard)
  getProfile(@User() user: UserAuthModel): Promise<UserEntity> {
    return this._personService.getProfile(user._id);
  }

  @PutInfo('/profile', null, UpdateProfileDto, false, {
    summary: 'update user profile',
  })
  async updateProfile(
    @User() user: UserAuthModel,
    @Body() data: UpdateProfileDto,
  ): Promise<void> {
    await this._personService.updateProfile(user._id, data);
  }


  @PutInfo('/change/password', null, UpdatePasswordDto, false, {
    summary: 'update old password to new password',
  })
  async updatePassword(
    @User() user: UserAuthModel,
    @Body() data: UpdatePasswordDto,
  ): Promise<void> {
    await this._personService.changePassword(user._id, data);
  }
}
