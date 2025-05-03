import { Controller, Get } from '@nestjs/common';
import { ScraperService } from './scrape.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoxOfficeResponseDto, MovieDto } from './dto/movie.dto';

@ApiTags('Box Office')
@Controller('box-office')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('domestic')
  @ApiOperation({ summary: 'Get domestic box office data' })
  @ApiResponse({ status: 200, type: BoxOfficeResponseDto })
  async getDomestic() {
    const data = await this.scraperService.getDomestic();
    return {
      lastUpdated: new Date(),
      data,
    };
  }

  @Get('worldwide')
  @ApiOperation({ summary: 'Get worldwide box office data' })
  @ApiResponse({ status: 200, type: BoxOfficeResponseDto })
  async getWorldwide() {
    const data = await this.scraperService.getWorldwide();
    return {
      lastUpdated: new Date(),
      data,
    };
  }


  @Get()
  @ApiOperation({ summary: 'Get all box office data' })
  @ApiResponse({ status: 200 })
  async getAllData() {
    return this.scraperService.getAllData();
  }

  @Get('weekend')
@ApiOperation({ summary: 'Get weekend box office data' })
@ApiResponse({ status: 200, type: BoxOfficeResponseDto })
async getWeekend() {
  const data = await this.scraperService.getWeekend();
  return {
    lastUpdated: new Date(),
    data,
  };
}

@Get('daily')
@ApiOperation({ summary: 'Get daily box office data' })
@ApiResponse({ status: 200, type: BoxOfficeResponseDto })
async getDaily() {
  const data = await this.scraperService.getDaily();
  return {
    lastUpdated: new Date(),
    data,
  };
}

  @Get('refresh')
  @ApiOperation({ summary: 'Force refresh of all box office data' })
  @ApiResponse({ status: 200 })
  async forceRefresh() {
    return this.scraperService.forceRefreshCache();
  }
}