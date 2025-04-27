import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScraperService } from '../scrape.service';

@Injectable()
export class RefreshCacheTask {
  private readonly logger = new Logger(RefreshCacheTask.name);

  constructor(private readonly scraperService: ScraperService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRefreshCache() {
    this.logger.log('Refreshing Box Office Mojo cache...');
    try {
      await this.scraperService.forceRefreshCache();
      this.logger.log('Cache refreshed successfully');
    } catch (error) {
      this.logger.error('Failed to refresh cache', error.stack);
    }
    
  }

  
  @Cron('0 12 * * *') // Every day at noon
  async refreshWeekendData() {
    this.logger.log('Refreshing weekend box office data...');
    try {
      const data = await this.scraperService.getAllData();
    //  data.weekend = await this.scraperService.scrapeWeekend();
      data.lastUpdated = new Date();
      await this.scraperService.forceRefreshCache();
      this.logger.log('Weekend data refreshed successfully');
    } catch (error) {
      this.logger.error('Failed to refresh weekend data', error.stack);
    }
  }
}