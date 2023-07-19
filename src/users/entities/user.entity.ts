import { ApiProperty } from '@nestjs/swagger';
import { Category, Follows, User } from '@prisma/client';
import { RoleString } from '../users.role';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: RoleString[];

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  category?: Category[];

  @ApiProperty()
  following?: Follows[];

  @ApiProperty()
  totalFollowing?: number;

  @ApiProperty()
  followers?: Follows[];

  @ApiProperty()
  totalFollowers?: number;

  @ApiProperty()
  createdAt: Date;
}
