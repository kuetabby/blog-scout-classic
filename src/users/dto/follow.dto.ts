import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FollowDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  targetAddress: string;
}
