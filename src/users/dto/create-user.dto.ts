import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(40)
  @ApiProperty()
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  username: string;
}
