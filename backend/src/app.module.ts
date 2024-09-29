import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { IntegrationService } from './integration/integration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),
    HttpModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, IntegrationService],
})
export class AppModule {}
