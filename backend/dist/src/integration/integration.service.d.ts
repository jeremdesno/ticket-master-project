import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EventsResponse } from './types';
import { DatabaseService } from '../common/database.service';
import { EventDataModel } from '../common/models';
export declare class IntegrationService {
    private httpService;
    private configService;
    private databaseService;
    private readonly baseUrl;
    private readonly apiKey;
    private readonly database;
    constructor(httpService: HttpService, configService: ConfigService, databaseService: DatabaseService);
    makeRequest<T>(url: string): Promise<T>;
    getEvents(): Promise<EventsResponse>;
    parsePageEvents(data: EventsResponse): Promise<EventDataModel[]>;
    upsertEvent(event: EventDataModel): Promise<void>;
    parseAndSaveEvents(data: EventsResponse): Promise<void>;
}
