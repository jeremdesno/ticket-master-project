import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { IntegrationService } from './integration/integration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, IntegrationService, DatabaseService],
})
export class AppModule {}
