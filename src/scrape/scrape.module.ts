// src/scraper/scraper.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScraperService } from './scrape.service';
import { ScraperController } from './scrape.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    HttpModule,
    CacheModule.register(), // Add this line
    ScheduleModule.forRoot(),],
  providers: [ScraperService],
  controllers: [ScraperController],
})
export class ScraperModule {}