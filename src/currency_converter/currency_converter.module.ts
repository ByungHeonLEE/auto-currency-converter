import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CurrencyConverterController } from './currency_converter.controller';
import { CurrencyConverterService } from './currency_converter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExRateEntity } from 'src/entity/exrate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExRateEntity]), ConfigModule],
  controllers: [CurrencyConverterController],
  providers: [CurrencyConverterService],
  exports: [CurrencyConverterService, TypeOrmModule]
})
export class CurrencyConverterModule {}
