import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExRateEntity } from 'src/entity/exrate.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CurrencyConverterService {
  private readonly baseUrl =
    'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?';
  private exchangeRateApiUrl: string;
  private readonly authKey = this.configService.get<string>("AUTHKEY");

  constructor(
    @InjectRepository(ExRateEntity)
    private exRateRepository: Repository<ExRateEntity>,
    private readonly configService: ConfigService,
  ) {
    this.handleCron();
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleCron() {
    this.buildUrl(); // Build today's URL
    console.log(this.exchangeRateApiUrl);
    let data = await this.fetchData(this.exchangeRateApiUrl);

    let attempts = 0;
    const maxAttempts = 7; // Prevent infinite loops, adjust as needed
    let previousDay = new Date();

    // Loop until data is found or max attempts reached
    while ((!data || data.length === 0) && attempts < maxAttempts) {
      attempts++;
      previousDay.setDate(previousDay.getDate() - 1);

      const previousDayUrl = this.buildPreviousDayUrl(previousDay);
      data = await this.fetchData(previousDayUrl);

      // Log to check each attempted URL (optional)
      console.log(`Attempt ${attempts}: ${previousDayUrl}`);
    }

    if (data && data.length > 0) {
      await this.prepareAndSaveRate(data);
    } else {
      console.log('No valid data found after several attempts.');
    }
  }

  public async fetchData(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      console.error('Error fetching data', err);
      throw new Error('Failed to fetch');
    }
  }

  // Assuming this is within your ExRateService
  public async prepareAndSaveRate(data: any[]): Promise<ExRateEntity> {
    const rate = new ExRateEntity();

    // Assuming 'data' is already the parsed JSON array
    data.forEach((item) => {
      const currencyCode = item.cur_unit
        .toUpperCase()
        .replace(/[\(\)100]/g, '');
      let dealBasR = item.deal_bas_r
        ? parseFloat(item.deal_bas_r.replace(/,/g, ''))
        : 0; // 제공되지 않은 경우 기본값으로 0 설정
        if (currencyCode == "IDR" || currencyCode == "JPY") {
            dealBasR = dealBasR/100;
        }
      rate[currencyCode] = dealBasR;
    });

    // Now, call saveRate with the prepared entity
    return this.saveRate(rate);
  }

  private async saveRate(exrate: ExRateEntity): Promise<ExRateEntity> {
    const newRate = this.exRateRepository.create(exrate);
    return await this.exRateRepository.save(newRate);
  }

  private async deleteRate(id: number): Promise<number> {
    await this.exRateRepository.delete(id);
    return id;
  }

  private async findRate(id: number): Promise<ExRateEntity> {
    return await this.exRateRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async findAll(): Promise<ExRateEntity[]> {
    return this.exRateRepository.find();
  }

  getFormattedDate(theDay: Date): string {
    const year = theDay.getFullYear();
    const month = `${theDay.getMonth() + 1}`.padStart(2, '0'); // Months are 0-indexed
    const day = `${theDay.getDate()}`.padStart(2, '0');

    return `${year}${month}${day}`;
  }

  private buildUrl(): void {
    // const authKey: string = this.configService.get<string>('AUTHKEY');
    const theDate: Date = new Date();
    const formattedDate = this.getFormattedDate(theDate);
    this.exchangeRateApiUrl =
      this.baseUrl +
      `authkey=${this.authKey}&` +
      `searchdate=${formattedDate}&` +
      `data=AP01`;
  }

  private buildPreviousDayUrl(theDay: Date = new Date()): string {
    const formattedDate = this.getFormattedDate(theDay);
    return (
      this.baseUrl +
      `authkey=${this.authKey}&` +
      `searchdate=${formattedDate}&` +
      `data=AP01`
    );
  }

  public async convertCurrency(from: string, to: string, amount: number): Promise<number> {
    const latestRate = await this.getLatestExchangeRates();
    const testId = latestRate['id'];
    console.log(testId);
    const fromRate = latestRate[from];
    const toRate = latestRate[to];

    if (!fromRate || !toRate) {
      throw new Error(`Invalid currency code: ${!fromRate ? from : to}`);
    }
  
    const baseAmount = amount / toRate; // Convert amount to base currency (assumed KRW in your structure)
    const convertedAmount = baseAmount * fromRate; // Convert from base currency to target currency
  
    return convertedAmount;
  }
  

  async getLatestExchangeRates(): Promise<ExRateEntity> {
    try {
      const latestRates: ExRateEntity[] = await this.exRateRepository.find({
        order: {
            CreatedAt: 'DESC',
        },
      });
      const latestRate: ExRateEntity = latestRates[0];
      if (!latestRate) {
        throw new Error('No exchange rate data available');
      }
      return latestRate;
    } catch (error) {
      throw new Error('Failed to fetch latest exchange rates');
    }
  }
  
}
