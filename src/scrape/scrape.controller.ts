// src/scraper/scraper.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ScraperService, Movie, WorldwideMovie } from './scrape.service';

@Controller('box-office')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('domestic')
  async getDomestic(): Promise<Movie[]> {
    const movies= await this.scraperService.scrapeTopDomesticMovies();
    console.log('Domestic Movies:', movies);
    return movies;
  }

  @Get('worldwide')
  async getWorldwide(): Promise<WorldwideMovie[]> {
    return this.scraperService.scrapeTopWorldwideMovies();
  }

  @Get('combined')
  async getCombined() {
    return this.scraperService.scrapeCombinedData();
  }
}