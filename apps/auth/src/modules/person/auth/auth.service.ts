import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonService } from '../person.service';
import {
  AppConfig,
  appConfig,
  BadgeEnum,
  base64Encode,
  JwtConfig,
  jwtConfig,
  objectId,
  Payload,
  randomHex,
  RedisHelperService,
  RedisPrefixesEnum,
  RedisServiceEnum,
  RedisSubPrefixesEnum,
  Tokens,
  UpdateResultModel,
  UserAuthModel,
} from '@lib/shared';
import crypto from 'crypto';
import { EmailService } from './email.service';
import { ClientEntity, UserEntity } from '@lib/auth/entities';
import { ObjectId } from 'typeorm';
import { LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto } from '@lib/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly _jwtConfig: JwtConfig,
    @Inject(appConfig.KEY)
    private readonly _appConfig: AppConfig,
    private readonly _personService: PersonService,
    private readonly _jwtService: JwtService,
    private readonly _emailService: EmailService,
    private readonly _redisHelperService: RedisHelperService
  ) {}

  async loginAndValidate(data: LoginDto): Promise<UserEntity> {
    const { email, password } = data;
    const user: UserEntity = await this._personService.getUserWithEmail(email);
    if (!user) return null;
    try {
      if (await this._personService.comparePassword(password, user.password)) {
        delete user.password;
        return user;
      }
    } catch (e) {
      console.error('an error in login happened', e);
      return null;
    }

    return null;
  }

  async register(data: RegisterDto): Promise<UserEntity> {
    if (BadgeEnum.Admin === data.badge) {
      throw new ForbiddenException('you do not have the permission to do that');
    }
    data.password = await this._personService.hashPassword(data.password);
    const exists = await this._personService._checkUserExistence(
      data.email
    );

    if (exists) throw new ConflictException('email or mobile already exists');

    return this._personService.createUser(data).then((res) => {
      this._generateTokenAndSendEmail(true, res._id, data.email, res.fullName);
      return res;
    });
  }

  async generateToken(
    user: UserAuthModel | UserEntity,
    clientId: string,
    userAgent: string,
    ip: string
  ): Promise<Tokens> {
    const refreshToken: string = this.createRefreshToken({ ...user, clientId });
    const decodedRefreshToken: Payload = this._jwtService.decode(
      refreshToken
    ) as Payload;

    let client: ClientEntity = await this._personService.findClient(
      user._id,
      clientId
    );

    if (!client) client = new ClientEntity();

    console.debug(`generated refresh token was: ${refreshToken}`);

    client.refreshToken = this.hashRefreshToken(refreshToken);
    client.expiry = new Date(decodedRefreshToken.exp * 1000);
    client.userAgent = userAgent;
    client.userId = user._id;
    client.clientId = clientId;
    client.ip = ip;

    console.debug({
      message: 'generated client',
      client,
    });

    await this._personService.saveClient(client);

    return {
      accessToken: this.createAccessToken({ ...user, clientId }),
      refreshToken,
    };
  }

  async forgot(email: string): Promise<void> {
    const user = await this._personService.getUserWithEmail(email);

    if (!user) throw new NotFoundException('user not found');

    await this._generateTokenAndSendEmail(false, user._id, email, user.fullName);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { password, _id, token, email } = resetPasswordDto;

    const newPasswordHash = await this._personService.hashPassword(password);

    const user = await this._personService.getOne(_id, { email });

    if (!user) throw new NotFoundException('user not found');

    const isNewPasswordSameAsTheOld = await this._personService.comparePassword(
      password,
      user.password
    );

    if (isNewPasswordSameAsTheOld)
      throw new ConflictException(
        'New password cannot be the same as the old one'
      );

    await this._validateTokenAndDelete(_id, token, false);

    await this._personService.updatePassword(newPasswordHash, user._id);
  }

  async verify(verifyEmailDto: VerifyEmailDto): Promise<UpdateResultModel> {
    const { _id, token, email } = verifyEmailDto;

    const user = await this._personService.getOne(_id, { email });

    if (!user) throw new NotFoundException('user not found');

    if (user.isVerified) throw new BadRequestException('user already verified');

    await this._validateTokenAndDelete(_id, token, true);

    await this._personService.verifyUser(user._id);

    return { status: true };
  }

  createAccessToken(user: Partial<UserAuthModel>): string {
    return this._jwtService.sign(this._generatePayload(user), {
      secret: this._jwtConfig.jwtAccessTokenSecret,
      expiresIn: this._jwtConfig.jwtAccessTokenExpirationTime,
    });
  }

  compareRefreshTokens(
    requestRefreshToken: string,
    userRefreshToken: string
  ): boolean {
    return this.hashRefreshToken(requestRefreshToken) === userRefreshToken;
  }

  createRefreshToken(user: Partial<UserAuthModel>): string {
    return this._jwtService.sign(this._generatePayload(user), {
      secret: this._jwtConfig.jwtRefreshTokenSecret,
      expiresIn: this._jwtConfig.jwtRefreshTokenExpirationTime,
    });
  }

  hashRefreshToken(refreshToken: string): string {
    return crypto.createHash('md5').update(refreshToken).digest('hex');
  }

  async logout(user: UserAuthModel): Promise<void> {
    const client: ClientEntity = await this._personService.findClient(
      user._id,
      user.clientId
    );
    await this.removeRefreshToken(client._id);
  }

  async removeRefreshToken(id: ObjectId): Promise<void> {
    await this._personService.removeRefreshToken(id);
  }

  private _generateTokenAndSendEmail(
    isVerifyEmail: boolean,
    id: objectId,
    email: string,
    userName: string
  ): void {
    const token = randomHex(20);

    const key = this._getRedisKey(id, isVerifyEmail);

    this._redisHelperService.setCache<string>(key, token);
    const url = this._generateLink(
      id,
      email,
      token,
      isVerifyEmail ? 'verify' : 'reset'
    );

    const subject = isVerifyEmail
      ? 'Verify Your Email Address'
      : 'Reset Your Password';
    this._emailService.sendEmail(
      email,
      subject,
      isVerifyEmail ? 'verify' : 'reset',
      {
        url,
        userName,
      }
    );
  }

  private _getRedisKey(userId: objectId, isVerify: boolean): string {
    return this._redisHelperService.getStandardKey(
        RedisServiceEnum.Auth,
        RedisPrefixesEnum.User,
        isVerify
          ? RedisSubPrefixesEnum.Verify
          : RedisSubPrefixesEnum.ResetPassword,
        userId as string
      );
  }

  private async _validateTokenAndDelete(
    userId: objectId,
    token: string,
    isVerify: boolean
  ) {
    const tokenKey = this._getRedisKey(userId, isVerify);

    const tokenFromRedis = await this._redisHelperService.getCache<string>(
      tokenKey
    );

    if (!tokenFromRedis || token !== tokenFromRedis)
      throw new BadRequestException('link is broken');

    await this._redisHelperService.removeCache(tokenKey);
  }

  private _generatePayload(user: Partial<UserAuthModel>): Payload {
    return {
      _id: user._id,
      email: user.email,
      isActive: user.isActive,
      clientId: user?.clientId,
    };
  }

  private _generateLink(
    userId: objectId,
    email: string,
    token: string,
    context: 'reset' | 'verify'
  ): string {
    return `${this._appConfig.clientHost}/${context}?ui=${base64Encode(
      userId.toString()
    )}&ue=${base64Encode(email)}&tk=${base64Encode(token)}`;
  }
}
