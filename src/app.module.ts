import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllResponseInterceptor } from './all-inteceptors';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { CategoryModule } from './category/category.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

// import * as redisStore from 'cache-manager-redis-store';
// import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: 20000, max: 10 }),
    UsersModule,
    PrismaModule,
    AuthModule,
    ArticlesModule,
    CommentsModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: AllResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule {}
