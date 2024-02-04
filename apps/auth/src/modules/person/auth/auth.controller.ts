import { AuthService } from './auth.service';
import { Body, Headers, Ip, UseGuards } from '@nestjs/common';
import {
  HeaderNames,
  ModulesEnum,
  PostInfo,
  PutInfo,
  RouteTypeEnum,
  SetHeaders,
  TokensDto,
  UpdateResultModel,
  UserAgent,
  UserAuthModel,
} from '@lib/shared';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthControllerInfo, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, User, VerifyEmailDto } from '@lib/auth';
import { UserEntity } from '@lib/auth/entities';

@AuthControllerInfo(ModulesEnum.Auth, 'auth', RouteTypeEnum.PUBLIC)
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @PostInfo('login', LoginDto, false, {
    summary: 'user login by email and password',
    outputType: TokensDto,
  })
  @UseGuards(LocalAuthGuard)
  @SetHeaders({ [HeaderNames.DEVICE_ID]: true, [HeaderNames.USER_AGENT]: true })
  login(
    @User() user: UserAuthModel,
    @Headers(HeaderNames.DEVICE_ID) clientId: string,
    @UserAgent() userAgent: string,
    @Ip() ip: string
  ): Promise<TokensDto> {
    return this._authService.generateToken(user, clientId, userAgent, ip);
  }

  @PostInfo('register', RegisterDto, false, {
    summary: 'register user',
    description: 'this route registers user and returns the result user entity',
    outputType: UserEntity,
  })
  register(@Body() registerDto: RegisterDto): Promise<UserEntity> {
    return this._authService.register(registerDto);
  }

  @PostInfo('refresh', null, false, {
    summary: 'get fresh token with refresh token',
    outputType: TokensDto,
    outputIsArray: false,
  })
  @SetHeaders({ [HeaderNames.DEVICE_ID]: true, [HeaderNames.USER_AGENT]: true })
  @UseGuards(JwtRefreshGuard)
  refresh(
    @Headers(HeaderNames.DEVICE_ID) clientId: string,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
    @User() user: UserAuthModel,
  ): Promise<TokensDto> {
    return this._authService.generateToken(user, clientId, userAgent, ip);
  }

  @PutInfo('forgot', null, ForgotPasswordDto, false, {
    summary: 'forgot password',
    description: 'this route sends an forgot email password',
  })
  forget(@Body() { email }: ForgotPasswordDto): Promise<void> {
    return this._authService.forgot(email);
  }

  @PutInfo('reset/password', null, ResetPasswordDto, false, {
    summary: 'reset users password',
    description: 'this route reset the users password',
  })
  resetPassword(@Body() body: ResetPasswordDto) {
    return this._authService.resetPassword(body);
  }

  @PutInfo('verify', null, VerifyEmailDto, false, {
    summary: 'refresh users token',
    description: 'this route verifies users email',
    outputType: UpdateResultModel,
  })
  verify(@Body() verifyEmailDto: VerifyEmailDto): Promise<UpdateResultModel> {
    return this._authService.verify(verifyEmailDto);
  }

  @PutInfo('/logout', null, null, false, {
    summary: 'logout user',
  })
  @UseGuards(JwtRefreshGuard)
  @SetHeaders({ [HeaderNames.DEVICE_ID]: true, [HeaderNames.USER_AGENT]: true })
  async logout( @User() user: UserAuthModel): Promise<void> {
    await this._authService.logout(user);
  }
}
