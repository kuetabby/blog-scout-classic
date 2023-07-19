import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseResponseDTO } from 'src/app.response.dto';
import { AllArticlesResponse } from './dto/response-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({
      data: createArticleDto,
    });
  }

  async findAll(
    searchValue: string = '',
    page: number,
    pageSize: number,
  ): Promise<BaseResponseDTO<AllArticlesResponse>> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [articlesCount, articlesList] = await Promise.all([
      this.prisma.article.count({
        where: {
          OR: [{ title: { contains: searchValue } }],
        },
      }),
      this.prisma.article.findMany({
        where: {
          OR: [{ title: { contains: searchValue } }],
        },
        orderBy: {
          authorId: 'asc',
        },
        skip,
        take,
        include: {
          _count: {
            select: { comment: true },
          },
        },
      }),
    ]);

    return {
      totalRecord: articlesCount,
      content: articlesList,
    };
  }

  async findAllPublish(isPublish: boolean) {
    return await this.prisma.article.findMany({
      where: { published: isPublish },
      orderBy: { authorId: 'asc' },
      include: {
        _count: {
          select: { comment: true },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.article.findUnique({
      where: { id },
      include: { author: true, comment: true },
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    return await this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.article.delete({ where: { id } });
  }
}
