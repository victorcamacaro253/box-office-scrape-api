export interface Movie {
    rank: number;
    title: string;
    url: string;
    gross: string;
    worldwideGross?: string;
    releaseDate?: string;
  }
  

  export interface BoxOfficeData {
    lastUpdated: Date;
    domestic: Movie[];
    worldwide: Movie[];
   // weekend: Movie[];
  }