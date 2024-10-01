import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

import { IntegrationService } from './integration.service';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../../.env'),
    }),
  ],
  providers: [IntegrationService, DatabaseService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
