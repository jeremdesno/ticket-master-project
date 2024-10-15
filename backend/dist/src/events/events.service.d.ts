import { DatabaseService } from 'src/common/database.service';
import { EventDataModel, GenreDataModel } from 'src/common/models';
export declare class EventService {
    private readonly databaseService;
    private readonly database;
    constructor(databaseService: DatabaseService);
    getEvents(limit?: number, offset?: number): Promise<EventDataModel[]>;
    findByDateRange(startDate: string, endDate: string, limit?: number, offset?: number): Promise<EventDataModel[]>;
    getEvent(id: string): Promise<EventDataModel | null>;
    getGenres(): Promise<GenreDataModel[]>;
}
