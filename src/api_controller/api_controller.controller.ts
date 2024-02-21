import { Controller, Get, Query, Headers } from '@nestjs/common';
import { CurrencyConverterService } from '../currency_converter/currency_converter.service';

@Controller('currency-converter')
export class ApiControllerController {
    constructor(
        private readonly currencyConverterService: CurrencyConverterService,
    ){}

    @Get('/convert-for-traveler')
    async convertForTraveler(
        @Headers('accept-language') acceptLanguage: string,
        @Query('amount') amount: number,
        @Query('baseCurrency') baseCurrency: string
    ): Promise<number> {
        const languages = this.parseAcceptLanguage(acceptLanguage);
        
        // Filter out 'en-US' if there are other options
        const nonEnLanguages = languages.filter(lang => lang.code.toLowerCase() !== 'en');
        const preferredLanguages = nonEnLanguages.length > 0 ? nonEnLanguages : languages;

        // Select the top language, considering the order after sorting by quality
        const primaryLanguage = preferredLanguages[0].code.split('-')[0]; // Simplistic approach

        // Map the primary language to its currency
        const targetCurrency = this.mapLanguageToCurrency(primaryLanguage);

        // Convert the amount from the base currency to the target currency
        const convertedAmount = await this.currencyConverterService.convertCurrency(baseCurrency || 'USD', targetCurrency, amount);

        return convertedAmount;
    }

    private mapLanguageToCurrency(languageCode: string): string {
        const languageCurrencyMap = {
            'ko': 'KRW', // Korean to South Korean Won
            'jp': 'JPY', // Japanese to Japanese Yen
            // Add other language mappings as necessary
        };
        

        return languageCurrencyMap[languageCode.toLowerCase()] || 'USD'; // Default to USD or any sensible default
    }

    private parseAcceptLanguage(acceptLanguage: string) {
        const languages = acceptLanguage.split(',')
          .map(lang => {
            const parts = lang.split(';q=');
            return { code: parts[0], quality: parts.length > 1 ? parseFloat(parts[1]) : 1 };
          })
          .sort((a, b) => b.quality - a.quality); // Sort by quality, highest first
        
        return languages;
      }
      
}
