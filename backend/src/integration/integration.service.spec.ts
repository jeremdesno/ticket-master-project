import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { IntegrationService } from './integration.service';
import { CommonModule } from '../common/common.module';
import { RecommendationModule } from '../recommendation/recommendation.module';
import { EventSearchModule } from '../search/eventSearch.module';

describe('IntegrationService', () => {
  let service: IntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        EventSearchModule,
        RecommendationModule,
        CommonModule,
      ],
      providers: [IntegrationService],
    }).compile();

    service = module.get<IntegrationService>(IntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
