import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { PersonModule } from '../person.module';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtConfig, RedisHelperModule, appConfig, jwtConfig } from '@lib/shared';
import { EmailService } from './email.service';

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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy, LocalStrategy,EmailService],
  exports: [AuthService],
})
export class AuthModule {}
