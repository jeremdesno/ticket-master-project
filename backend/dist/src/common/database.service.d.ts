import { ConfigService } from '@nestjs/config';
import { Kysely } from 'kysely';
import { DatabaseSchema } from './models';
export declare class DatabaseService {
    private configService;
    private readonly database;
    constructor(configService: ConfigService);
    getDatabase(): Kysely<DatabaseSchema>;
}
