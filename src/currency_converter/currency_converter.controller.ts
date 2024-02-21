import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyConverterService } from './currency_converter.service';

@Controller('currency-converter')
export class CurrencyConverterController {
    constructor(
        private readonly currencyConverterService: CurrencyConverterService,
    ){}

    @Get('/convert')
    async convert(
        @Query('from') from: string, 
        @Query('to') to: string, 
        @Query('amount') amount: number
    ): Promise<number> {
        const convertedAmount = await this.currencyConverterService.convertCurrency(from, to, amount);
        return convertedAmount;
    }
}
