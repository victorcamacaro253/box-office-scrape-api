export interface Movie {
  rank: number;
  title: string;
  url: string;
  gross: string;
  worldwideGross?: string;
  releaseDate?: string;
  theaters?: string;       // For weekend data
  change?: string;         // For weekend data
  dailyGross?: string;     // For daily data
  daysInRelease?: number;  // For daily data
  weekend?: string;         // For weekend data
  date?: string;
}

export interface BoxOfficeData {
  lastUpdated: Date;
  domestic: Movie[];
  worldwide: Movie[];
  weekend: Movie[];
  daily: Movie[];
}