import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigService],
  providers: [DatabaseService],
})
export class DatabaseModule {}
