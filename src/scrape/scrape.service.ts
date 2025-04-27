// src/scraper/scraper.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { firstValueFrom } from 'rxjs';

export interface Movie {
  rank: number;
  title: string;
  url: string;
  gross: string;
}

export interface WorldwideMovie {
  rank: number;
  title: string;
  url: string;
  worldwideGross: string;
}

@Injectable()
export class ScraperService {
  constructor(private readonly httpService: HttpService) {}

  private async fetchHtml(url: string): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      }),
    );
    return response.data;
  }

  async scrapeTopDomesticMovies(): Promise<Movie[]> {
    const url = 'https://www.boxofficemojo.com/';
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
  //  console.log('Scraping domestic movies...',$);
    
    const movies: Movie[] = [];
    
    $('.mojo-feature-yrdom table tbody tr').each((index, element) => {
      const titleElement = $(element).find('.mojo-field-type-release a');
      console.log('Title Element:', titleElement);
      const title = titleElement.text().trim();
      const url = `https://www.boxofficemojo.com${titleElement.attr('href')}`;
      const gross = $(element).find('.mojo-field-type-money').text().trim();
  
      movies.push({
        rank: index + 1,
        title,
        url,
        gross,
      });
    });
    
    return movies;
  }

  async scrapeTopWorldwideMovies(): Promise<WorldwideMovie[]> {
    const url = 'https://www.boxofficemojo.com';
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    
    const movies: WorldwideMovie[] = [];
    
    $('.mojo-feature-yrww table tbody tr').each((index, element) => {
      const titleElement = $(element).find('.mojo-field-type-release_group a');
      const title = titleElement.text().trim();
      const url = `https://www.boxofficemojo.com${titleElement.attr('href')}`;
      const worldwideGross = $(element).find('.mojo-field-type-money').text().trim();
      
      movies.push({
        rank: index + 1,
        title,
        url,
        worldwideGross,
      });
    });
    
    return movies;
  }

  async scrapeCombinedData(): Promise<any> {
    const [domestic, worldwide] = await Promise.all([
      this.scrapeTopDomesticMovies(),
      this.scrapeTopWorldwideMovies(),
    ]);
    
    // Combine data by title (this is a simple approach, you might need more sophisticated matching)
    const combined = domestic.map(dMovie => {
      const wMovie = worldwide.find(w => w.title === dMovie.title);
      return {
        ...dMovie,
        worldwideGross: wMovie?.worldwideGross || 'N/A',
      };
    });
    
    return {
      domestic,
      worldwide,
      combined,
    };
  }
}