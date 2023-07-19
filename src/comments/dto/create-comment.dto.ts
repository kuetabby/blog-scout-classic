import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty()
  content: string;

  @IsNumber()
  @ApiProperty()
  articleId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  authorId?: number;
}
