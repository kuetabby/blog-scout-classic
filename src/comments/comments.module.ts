import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [PrismaModule, UsersModule, ArticlesModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
