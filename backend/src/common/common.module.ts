import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseService, ConfigService],
  exports: [DatabaseService],
})
export class CommonModule {}
