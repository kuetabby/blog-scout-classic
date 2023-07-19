import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  NotFoundException,
  Delete,
  ParseIntPipe,
  Query,
  Inject,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { User } from './users.decorator';
import { UserEntity } from './entities/user.entity';

import { JwtAuthGuard } from 'src/auth/auth.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowDto } from './dto/follow.dto';
import { CACHE_MANAGER, CacheKey } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
// import { Roles } from './users.role.decorator';
// import { Role } from '@prisma/client';
// import { RolesGuard } from './users.role.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create({
      ...createUserDto,
      username: 'unnamed',
    });
  }

  @Get()
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  // @CacheKey('all_users')
  async getAll(
    @Query('searchValue') searchValue?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const cachedUsers = await this.cacheManager.get<any>('all_users');

    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

    const users = await this.usersService.getAll(
      searchValue,
      !!page ? +page : 1,
      !!pageSize ? +pageSize : 10,
    );
    await this.cacheManager.set('all_users', users);

    return users;
  }

  @Get('/category/:id')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getUserByCategory(@Param('id', ParseIntPipe) id: string) {
    return await this.usersService.getByCategory(+id);
  }

  @Get('/following/:address')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getFollowingByAddress(@Param('address') address: string) {
    return await this.usersService.getFollowingByAddress(address);
  }

  @Get('/follower/:address')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getFollowersByAddress(@Param('address') address: string) {
    return await this.usersService.getFollowersByAddress(address);
  }

  @Post('/follow')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async followAddress(@User() user, @Body() followDto: FollowDto) {
    return await this.usersService.followAddress(
      user.address,
      followDto.targetAddress,
    );
  }

  @Post('/unfollow')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async unfollowAddress(@User() user, @Body() followDto: FollowDto) {
    return await this.usersService.unfollowAddress(
      user.address,
      followDto.targetAddress,
    );
  }

  @Get(':address')
  @ApiOkResponse({ type: UserEntity })
  async getByAddress(@Param('address') address: string) {
    const user = await this.usersService.getByAddress(address);
    if (user) return new UserEntity(user);
    throw new NotFoundException(`User with ${address} doesn't exist`);
  }

  @Post(':address')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async updateByAddress(@User() user, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateByAddress(user.address, updateUserDto);
  }

  @Delete(':address')
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('address') address: string) {
    return await this.usersService.removeByAddress(address);
  }
}
