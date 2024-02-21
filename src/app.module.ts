import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrencyConverterModule } from './currency_converter/currency_converter.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { typeORMConfig } from 'typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiControllerModule } from './api_controller/api_controller.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: path.join(__dirname, `../envs/.env`),
    }),
    CurrencyConverterModule,
    ApiControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
