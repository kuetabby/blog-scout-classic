import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  ParseIntPipe,
  Query,
  Inject,
  CacheTTL,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/users/users.decorator';
import { CACHE_MANAGER, CacheKey } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(@User() user, @Body() createArticleDto: CreateArticleDto) {
    const createArticle = await this.articlesService.create({
      ...createArticleDto,
      authorId: user.id,
    });
    return new ArticleEntity(createArticle);
  }

  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  @CacheKey('all_articles')
  async findAll(
    @Query('searchValue') searchValue?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const articles = await this.articlesService.findAll(
      searchValue,
      !!page ? +page : 1,
      !!pageSize ? +pageSize : 10,
    );

    return articles;
  }

  @Get('published')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  findAllPublished() {
    return this.articlesService.findAllPublish(true);
  }

  @Get('draft')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  findAllDraft() {
    return this.articlesService.findAllPublish(false);
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const article = await this.articlesService.findOne(+id);
    if (!article) {
      throw new NotFoundException(`Article with ${id} does not exist.`);
    }
    return new ArticleEntity(article);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ArticleEntity })
  async update(
    @User() user,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.articlesService.findOne(+id);

    if (article) {
      if (article.authorId === user.id) {
        const updateArticle = await this.articlesService.update(
          article.id,
          updateArticleDto,
        );
        return new ArticleEntity(updateArticle);
      }

      throw new NotFoundException(`Invalid Author`);
    }

    throw new NotFoundException(`Article with ${+id} doesn't exist`);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@User() user, @Param('id', ParseIntPipe) id: string) {
    const article = await this.articlesService.findOne(+id);
    if (article) {
      if (article.authorId === user.id || user.role[0] === 'ADMIN') {
        return await this.articlesService.remove(+id);
      }

      throw new NotFoundException(`Invalid Author`);
    }
    throw new NotFoundException(`Article with ${+id} doesn't exist`);
  }
}
