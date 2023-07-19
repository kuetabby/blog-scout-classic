import { Category, User } from '@prisma/client';

export type AllUsersResponse = (User & {
  category: Category;
  _count: {
    followers: number;
    following: number;
    articles: number;
  };
})[];
