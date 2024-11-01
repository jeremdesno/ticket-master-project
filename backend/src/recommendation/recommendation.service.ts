import { HfInference } from '@huggingface/inference';
import { Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

import { EventPointStruct } from './types';

@Injectable()
export class RecommendationService {
  private readonly qdrantClient: QdrantClient;
  private readonly hfClient: HfInference;
  private readonly QdrantCollectionName: string;
  private readonly embeddingModel: string;
  private readonly vectorSize: number;

  constructor() {
    const configPath = path.join(process.cwd(), 'src/recommendation/model_config.yaml');
    const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));

    this.embeddingModel = config.embedding_model;
    this.vectorSize = config.vector_size;

    this.qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL,
    });
    this.hfClient = new HfInference(process.env.HUGGING_FACE_API_KEY);
    this.QdrantCollectionName = process.env.QDRANT_COLLECTION_NAME;
  }

  async embedEvents(eventDescriptions: string[]): Promise<number[][]> {
    const embedding = await this.hfClient.featureExtraction({
      model: this.embeddingModel,
      inputs: eventDescriptions,
    });
    return embedding as number[][];
  }

  async createCollectionIfNotExists(): Promise<boolean> {
    const exists = await this.qdrantClient.collectionExists(
      this.QdrantCollectionName,
    );
    if (!exists.exists) {
      console.log(`Creating Collection ${this.QdrantCollectionName}`);
      return await this.qdrantClient.createCollection(
        this.QdrantCollectionName,
        {
          vectors: { size: this.vectorSize, distance: 'Dot' },
        },
      );
    }
    return true;
  }

  async addVectorsToQdrant(eventsPoints: EventPointStruct[]): Promise<void> {
    await this.qdrantClient.upsert(this.QdrantCollectionName, {
      wait: true,
      points: eventsPoints,
    });
  }
}
