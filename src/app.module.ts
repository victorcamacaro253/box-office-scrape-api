import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scrape/scrape.module';

@Module({
  imports: [ScraperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
