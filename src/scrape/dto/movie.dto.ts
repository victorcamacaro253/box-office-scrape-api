import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty()
  rank: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  gross: string;

  @ApiProperty({ required: false })
  worldwideGross?: string;

  @ApiProperty({ required: false })
  releaseDate?: string;

  @ApiProperty({ required: false })
  change?: string;

  @ApiProperty({ required: false })
  dailyGross?: string;

  @ApiProperty({ required: false })
  daysInRelease?: number;
}

export class ScraperResponseDto {
  @ApiProperty({ type: [MovieDto] })
  domestic: MovieDto[];

  @ApiProperty({ type: [MovieDto] })
  worldwide: MovieDto[];

  @ApiProperty()
  lastUpdated: Date;

  @ApiProperty({ required: false })
  change?: string;

  @ApiProperty({ required: false })
  dailyGross?: string;

  @ApiProperty({ required: false })
  daysInRelease?: number;
}

export class BoxOfficeResponseDto {
    @ApiProperty()
    lastUpdated: Date;
    
    @ApiProperty({ type: [MovieDto] })
    data: MovieDto[];
  }