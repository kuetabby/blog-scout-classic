import { ApiProperty } from '@nestjs/swagger';
import { CategoryName } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: CategoryName;
}
