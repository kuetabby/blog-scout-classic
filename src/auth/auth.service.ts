import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(address: string) {
    let user = await this.prisma.user.findUnique({ where: { address } });

    if (!user) {
      user = await this.userService.create({ address, username: 'unnamed' });
    }

    const payload = {
      sub: user.id,
      address: user.address,
      username: user.username,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
