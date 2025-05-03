import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { firstValueFrom } from 'rxjs';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BoxOfficeData, Movie } from './interfaces/movie.interface';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly CACHE_KEY = 'boxOfficeData';
  private readonly CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds
  private lastRequestTime: number = 0;
  private readonly REQUEST_INTERVAL = 5000; // 5 seconds between requests

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async fetchHtml(url: string): Promise<string> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.REQUEST_INTERVAL) {
      const delay = this.REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch URL: ${url}`, error.stack);
      throw error;
    }
  }

  private async scrapeDomestic(): Promise<Movie[]> {
    const url = 'https://www.boxofficemojo.com';
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    
    const movies: Movie[] = [];
    
    $('.mojo-feature-yrdom table tbody tr').each((index, element) => {
      const titleElement = $(element).find('.mojo-field-type-release a');
      const title = titleElement.text().trim();
      const url = `https://www.boxofficemojo.com${titleElement.attr('href')}`;
      const gross = $(element).find('.mojo-field-type-money').first().text().trim();
      
      movies.push({
        rank: index + 1,
        title,
        url,
        gross,
      });
    });
    
    return movies;
  }

  private async scrapeWorldwide(): Promise<Movie[]> {
    const url = 'https://www.boxofficemojo.com';
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    
    const movies: Movie[] = [];
    
    $('.mojo-feature-yrww table tbody tr').each((index, element) => {
      const titleElement = $(element).find('.mojo-field-type-release_group a');
      const title = titleElement.text().trim();
      const url = `https://www.boxofficemojo.com${titleElement.attr('href')}`;
      const worldwideGross = $(element).find('.mojo-field-type-money').first().text().trim();
      
      movies.push({
        rank: index + 1,
        title,
        url,
        gross: worldwideGross,
      });
    });
    
    return movies;
  }

  private async scrapeDaily(): Promise<Movie[]> {
    const url = 'https://www.boxofficemojo.com';
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);

    const movies: Movie[] = [];

    // Loop through each tab for different dates
    $('.mojo-recent-dailies-widget-tab').each((index, tab) => {
        const date = $(tab).attr('class')?.match(/mojo-date-(\d{4}-\d{2}-\d{2})/);
        const dateStr = date ? date[1] : '';

        // Loop through each row in the table within the tab
        $(tab).find('table.mojo-table tbody tr').each((rowIndex, row) => {
            const titleElement = $(row).find('td:nth-child(1) a');
            const grossElement = $(row).find('td:nth-child(2) span.money');

            const title = titleElement.text().trim();
            const url = `https://www.boxofficemojo.com${titleElement.attr('href')}`;
            const dailyGross = grossElement.text().trim().replace(/[\$,]/g, ''); // Remove $ and commas

            if (title && dailyGross) {
                movies.push({
                    rank: rowIndex + 1,
                    title,
                    url,
                    gross: dailyGross,
                    dailyGross,
                    daysInRelease: 1, // You can adjust this if you have specific logic for this value
                    date: dateStr // Optional: You can store the date of the box office report
                });
            }
        });
    });

    return movies;
}

  private async scrapeWeekend(): Promise<Movie[]> {
    const url = 'https://www.boxofficemojo.com';
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
  
    const movies: Movie[] = [];
  
    // Use correct selector based on actual HTML structure
    $('.mojo-homepage-widget.mojo-feature-rw table tbody tr').each((index, element) => {
      const titleElement = $(element).find('.mojo-field-type-release a');
      const title = titleElement.text().trim();
      const url = `https://www.boxofficemojo.com${titleElement.attr('href')}`;
      const gross = $(element).find('.mojo-field-type-money').first().text().trim();
      const weekendHeading = $('.mojo-homepage-widget.mojo-feature-rw h2.mojo-heading').first().text().trim();
const weekendMatch = weekendHeading.match(/Latest Weekend:\s*(.+)/);
const weekendDate = weekendMatch ? weekendMatch[1] : '';

  
      movies.push({
        rank: index + 1,
        title,
        url,
        gross,
        theaters: '-',  // not available
        change: '-' ,
        weekend: weekendDate     // not available
      });
    });
  
    return movies.slice(0, 10);
  }
  

  /*
  private async scrapeWeekend(): Promise<Movie[]> {
    const url = 'https://www.boxofficemojo.com/weekend/';
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);
    
    const movies: Movie[] = [];
    
    $('.mojo-body-table table tbody tr').each((index, element) {
      const titleElement = $(element).find('.mojo-field-type-release a');
      const title = titleElement.text().trim();
      const url = `https://www.boxofficemojo.com${titleElement.attr('href')}`;
      const gross = $(element).find('.mojo-field-type-money').eq(0).text().trim();
      const theaters = $(element).find('.mojo-field-type-positive_integer').text().trim();
      const change = $(element).find('.mojo-field-type-percent').text().trim();
      
      movies.push({
        rank: index + 1,
        title,
        url,
        gross,
        theaters,
        change,
      });
    });
    
    return movies.slice(0, 10); // Return top 10 weekend movies
  } 
    */
  private async fetchFreshData(): Promise<BoxOfficeData> {
    try {
      const [domestic, worldwide,
        weekend,daily
        ] = await Promise.all([
        this.scrapeDomestic(),
        this.scrapeWorldwide(),
        this.scrapeWeekend(),
        this.scrapeDaily(),
      ]);

      const response: BoxOfficeData = {
        lastUpdated: new Date(),
        domestic,
        worldwide,
        weekend,
        daily
      };

      await this.cacheManager.set(this.CACHE_KEY, response, this.CACHE_TTL);
      return response;
    } catch (error) {
      this.logger.error('Failed to fetch fresh data', error.stack);
      throw error;
    }
  }

  private async getCachedData(): Promise<BoxOfficeData> {
    const cachedData = await this.cacheManager.get<BoxOfficeData>(this.CACHE_KEY);
    if (cachedData) {
        this.logger.log('Serving data from cache');
        console.log('Cached data:');
      return cachedData;
    } 
    console.log('No cached data found');
    this.logger.log('Fetching fresh data');
    return this.fetchFreshData();
  }

  async getDomestic(): Promise<Movie[]> {
    const data = await this.getCachedData();
    return data.domestic;
  }

  async getWorldwide(): Promise<Movie[]> {
    const data = await this.getCachedData();
    return data.worldwide;
  }
 async getWeekend(): Promise<Movie[]> {
    const data = await this.getCachedData();
    return data.weekend;
  } 

  async getAllData(): Promise<BoxOfficeData> {
    return this.getCachedData();
  }

  async forceRefreshCache(): Promise<BoxOfficeData> {
    await this.cacheManager.del(this.CACHE_KEY);
    return this.fetchFreshData();
  }

  async getDaily(): Promise<Movie[]> {
    const data = await this.getCachedData();
    return data.daily;
  }
}