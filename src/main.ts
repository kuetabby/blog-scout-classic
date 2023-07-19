import { NestFactory, Reflector } from '@nestjs/core';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { logger } from './logger.middleware';

export const moralisApiKey =
  'jCWIGceEbiCDjJLuNNWMlwd4KNqh3pl6t1XBSRF7VgdUL7js3EiHu5TCSg0o121H';
export const activeChain = EvmChain.BSC_TESTNET;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog Web3')
    .setDescription('Blog Web3 Description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(logger);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await Moralis.start({
    apiKey: moralisApiKey,
  });
  await app.listen(5000);
}
bootstrap();
