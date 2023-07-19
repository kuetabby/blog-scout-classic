import { Injectable } from '@nestjs/common';
import { CategoryName, Role, User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseResponseDTO } from 'src/app.response.dto';
import { AllUsersResponse } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        role: [Role.USER],
      },
    });
  }

  async getAll(
    searchValue: string = '',
    page: number,
    pageSize: number,
  ): Promise<BaseResponseDTO<AllUsersResponse>> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const categoryMatch = Object.values(CategoryName).filter((item) =>
      item.includes(searchValue?.toUpperCase()),
    );

    const searchDb = [
      { address: { contains: searchValue } },
      { username: { contains: searchValue } },
      { category: { name: { in: categoryMatch } } },
    ];

    const [userCount, userList] = await Promise.all([
      this.prisma.user.count({
        where: {
          OR: searchDb,
        },
      }),
      this.prisma.user.findMany({
        where: {
          OR: searchDb,
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take,
        include: {
          followers: false,
          following: false,
          category: true,
          _count: {
            select: { followers: true, following: true, articles: true },
          },
        },
      }),
    ]);

    return {
      totalRecord: userCount,
      content: userList,
    };
  }

  async getByAddress(address: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { address },
      include: {
        articles: false,
        category: true,
        _count: {
          select: { followers: true, following: true, articles: true },
        },
      },
    });

    return user;
  }

  async getByCategory(categoryId: number): Promise<User[]> {
    const user = await this.prisma.user.findMany({
      where: { categoryId },
      include: { category: true },
    });

    return user;
  }

  async getFollowersByAddress(address: string) {
    const followers = await this.prisma.user.findMany({
      where: { following: { some: { followerAddress: address } } },
    });

    return followers;
  }

  async getFollowingByAddress(address: string) {
    const following = await this.prisma.user.findMany({
      where: { followers: { some: { followingAddress: address } } },
    });

    return following;
  }

  async updateByAddress(address: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { address },
      data: updateUserDto,
    });
  }

  async removeByAddress(address: string) {
    return await this.prisma.user.delete({ where: { address } });
  }

  async followAddress(currentAddress: string, targetAddress: string) {
    return await this.prisma.follows.create({
      data: {
        followingAddress: currentAddress,
        followerAddress: targetAddress,
      },
    });
  }

  async unfollowAddress(currentAddress: string, targetAddress: string) {
    return await this.prisma.follows.delete({
      where: {
        followerAddress_followingAddress: {
          followingAddress: currentAddress,
          followerAddress: targetAddress,
        },
      },
    });
  }
}
