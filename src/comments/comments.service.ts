import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    return await this.prisma.comment.create({ data: createCommentDto });
  }

  async findAll() {
    return await this.prisma.comment.findMany({ include: { author: true } });
  }

  async findOne(id: number) {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    return await this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.comment.delete({ where: { id } });
  }
}
