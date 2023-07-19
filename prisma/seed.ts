// prisma/seed.ts

import { PrismaClient, Role, CategoryName, User } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  // await prisma.category.create({
  //   data: { name: 'INFLUENCER' },
  // });

  const admin = await prisma.user.upsert({
    where: { address: '0xCD75375183e40543aee583dc2a8DBdbE3Ca15CDA' },
    update: {
      role: [Role.ADMIN],
      category: { connect: { id: 1 } },
    },
    create: {
      address: '0xCD75375183e40543aee583dc2a8DBdbE3Ca15CDA',
      username: 'admin',
      role: Role.ADMIN,
    },
  });

  const profile1 = await prisma.user.upsert({
    where: { address: '0x08fB342522E0a7A3CBAE769AdFEFb09d42e33F8f' },
    update: {
      role: [Role.USER],
      category: { connect: { id: 2 } },
    },
    create: {
      address: '0x08fB342522E0a7A3CBAE769AdFEFb09d42e33F8f',
      username: 'john doe',
      role: Role.USER,
    },
  });

  await prisma.user.upsert({
    where: { address: '0x967b636d66180c18100C41AE76E588e4c7d6a476' },
    update: {},
    create: {
      address: '0x967b636d66180c18100C41AE76E588e4c7d6a476',
      username: 'john key',
      role: [Role.USER],
      category: { create: { name: 'TOKEN_CREATOR' } },
    },
  });

  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {},
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
      authorId: profile1.id,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {},
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
      authorId: profile1.id,
    },
  });

  console.log({ post1, post2, admin });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
