/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppConfig, Paginate, RpcPackageEnum, appConfig, corsConfig, grpcConfig, swaggerConfig } from '@lib/shared';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const compression = require('compression');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsConfiguration = await app.get(corsConfig.KEY);


  const appConfigInstance: AppConfig = app.get(appConfig.KEY);

  swaggerConfig(app, appConfigInstance, 'Auth', [Paginate]);

  if (corsConfiguration.enableCors) {
    app.enableCors({
      origin: corsConfiguration.accessControlAllowOrigin,
      credentials: corsConfiguration.accessControlAllowCredentials,
      methods: corsConfiguration.accessControlAllowMethods,
      maxAge: corsConfiguration.accessControlMaxAge,
      allowedHeaders: corsConfiguration.accessControlAllowHeaders,
    });
  }

  // enable gzip compression
  app.use(
    compression({
      filter: () => {
        return true;
      },
      threshold: 0,
      level: 1,
    }),
  );

  const grpcConfiguration = app.get(grpcConfig.KEY);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: RpcPackageEnum.Auth,
      url: '0.0.0.0:' + grpcConfiguration.grpcPort,
      protoPath: join(__dirname, 'assets-shared/auth.proto'),
    },
  }, { inheritAppConfig: true });

  await app.startAllMicroservices();

  await app.listen(appConfigInstance.port, () => {
    console.log(
      `🚀 Application is running on: http://${appConfigInstance.host}:${appConfigInstance.port}`,
    );
  });
}

bootstrap();
