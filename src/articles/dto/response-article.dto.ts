import { Article } from '@prisma/client';

export type AllArticlesResponse = (Article & {
  _count: {
    comment: number;
  };
})[];
