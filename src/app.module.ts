import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scrape/scrape.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';


@Module({
  imports: [ScraperModule,
    CacheModule.register({
      store: redisStore as any,
      host: 'localhost', // your redis server
      port: 6379,         // default Redis port
      ttl: 24 * 60 * 60,  // 24 hours in seconds
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
