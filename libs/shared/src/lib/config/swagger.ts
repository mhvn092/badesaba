import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './app.config';

export function swaggerConfig(
  app: INestApplication,
  appConfigInstance: AppConfig,
  appName: string,
  extraOptions?: any[],
) {
  const { host, port, serverHost } = appConfigInstance;
  const documentConfig = new DocumentBuilder()
    .setTitle(`${appName} API document`)
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://${host}:${port}`)
    .addServer(serverHost)
    .addServer(`http://localhost:${port}`)
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig, {
    extraModels: [...extraOptions],
  });
  SwaggerModule.setup('docs', app, document, { swaggerOptions: { docExpansion: 'all' } });
}
