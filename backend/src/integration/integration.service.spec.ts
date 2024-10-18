import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { IntegrationService } from './integration.service';
import { DatabaseService } from '../common/database.service';

describe('IntegrationService', () => {
  let service: IntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [IntegrationService, DatabaseService],
    }).compile();

    service = module.get<IntegrationService>(IntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
