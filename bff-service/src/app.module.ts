import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

const MINUTE = 60;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    CacheModule.register({
      ttl: 2 * MINUTE,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
