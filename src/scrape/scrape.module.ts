// src/scraper/scraper.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScraperService } from './scrape.service';
import { ScraperController } from './scrape.controller';

@Module({
  imports: [HttpModule],
  providers: [ScraperService],
  controllers: [ScraperController],
})
export class ScraperModule {}