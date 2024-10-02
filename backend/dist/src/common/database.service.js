"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kysely_1 = require("kysely");
const pg_1 = require("pg");
let DatabaseService = class DatabaseService {
    constructor(configService) {
        this.configService = configService;
        const postgresUser = this.configService.get('POSTGRES_USER');
        const postgresPassword = this.configService.get('POSTGRES_PASSWORD');
        const postgresDatabase = this.configService.get('POSTGRES_DB');
        console.log(`Connecting to database at 127.0.0.1:5433 as ${postgresUser}`);
        this.database = new kysely_1.Kysely({
            dialect: new kysely_1.PostgresDialect({
                pool: new pg_1.Pool({
                    host: '127.0.0.1',
                    port: 5433,
                    database: postgresDatabase,
                    user: postgresUser,
                    password: postgresPassword,
                }),
            }),
        });
    }
    getDatabase() {
        return this.database;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map