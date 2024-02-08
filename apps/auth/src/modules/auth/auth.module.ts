import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { ConfigModule } from '@nestjs/config';
import { PersonModule } from '../person/person.module';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { appConfig } from '@lib/shared';
import { RedisHelperModule } from '@lib/shared/modules/redis-helper';
import { EmailService } from './email.service';
import { JwtConfig, JwtStrategy, jwtConfig } from '@lib/auth';
import { AuthRpcController } from './auth.rpc.controller';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(appConfig),
    JwtModule.registerAsync({
      useFactory: (configService: JwtConfig): JwtModuleOptions => ({
        secret: configService.jwtAccessTokenSecret,
        signOptions: { expiresIn: configService.jwtAccessTokenExpirationTime },
      }),
      inject: [jwtConfig.KEY],
      imports: [ConfigModule.forFeature(jwtConfig)],
    }),
    PersonModule,
    RedisHelperModule,
    PassportModule,
  ],
  controllers: [AuthController, AuthRpcController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    LocalStrategy,
    EmailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
