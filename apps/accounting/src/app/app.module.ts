import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ACCOUNTING_MODULES } from './config/modules';

@Module({
  imports: ACCOUNTING_MODULES,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
