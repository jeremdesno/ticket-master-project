import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

import { IntegrationService } from './integration.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    HttpModule,
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../../.env'),
    }),
  ],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
