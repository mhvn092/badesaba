import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfig, JwtConfig } from './config/jwt.config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: JwtConfig): JwtModuleOptions => ({
        secret: configService.jwtAccessTokenSecret,
      }),
      inject: [jwtConfig.KEY],
      imports: [ConfigModule.forFeature(jwtConfig)],
    }),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class SharedJwtModule {}
