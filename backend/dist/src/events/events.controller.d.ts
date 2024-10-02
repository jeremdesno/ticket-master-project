import { EventService } from './events.service';
import { EventDataModel } from 'src/common/models';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    getEvents(limit?: number, offset?: number): Promise<EventDataModel[]>;
    findByDateRange(startDate: string, endDate: string, limit?: number, offset?: number): Promise<EventDataModel[]>;
    getEvent(id: string): Promise<EventDataModel | null>;
}
