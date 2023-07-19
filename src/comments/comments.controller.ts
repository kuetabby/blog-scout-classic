import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/users/users.decorator';
import { CommentEntity } from './entities/comment.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentEntity })
  async create(@User() user, @Body() createCommentDto: CreateCommentDto) {
    const comment = await this.commentsService.create({
      ...createCommentDto,
      authorId: user.id,
    });

    return new CommentEntity(comment);
  }

  @Get()
  @ApiOkResponse({ type: CommentEntity, isArray: true })
  async findAll() {
    const comments = await this.commentsService.findAll();
    return comments.map((comment) => new CommentEntity(comment));
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentEntity })
  async update(
    @User() user,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentsService.findOne(+id);
    if (comment) {
      if (
        (comment.authorId === user.id &&
          comment.articleId === updateCommentDto.articleId) ||
        user[0] === 'admin'
      ) {
        return this.commentsService.update(+id, updateCommentDto);
      }
      if (comment.articleId !== updateCommentDto.articleId) {
        throw new NotFoundException(`Invalid Article`);
      }

      throw new NotFoundException(`Invalid Author`);
    }
    throw new NotFoundException(`Comment with ${+id} doesn't exist`);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentEntity })
  async remove(@User() user, @Param('id', ParseIntPipe) id: string) {
    const comment = await this.commentsService.findOne(+id);

    if (comment) {
      if (comment.authorId === user.id || user[0] === 'ADMIN') {
        return await this.commentsService.remove(+id);
      }
      throw new NotFoundException(`Invalid Author`);
    }
    throw new NotFoundException(`Comment with ${+id} doesn't exist`);
  }
}
