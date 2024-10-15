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
exports.IntegrationService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const database_service_1 = require("../common/database.service");
let IntegrationService = class IntegrationService {
    constructor(httpService, configService, databaseService) {
        this.httpService = httpService;
        this.configService = configService;
        this.databaseService = databaseService;
        this.baseUrl = 'https://app.ticketmaster.com';
        this.apiKey = this.configService.get('TICKETMASTER_API_KEY');
        this.database = this.databaseService.getDatabase();
    }
    async makeRequest(url) {
        const maxRetries = 5;
        let retryCount = 0;
        while (retryCount < maxRetries) {
            try {
                const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(url));
                return response.data;
            }
            catch (error) {
                if (error.response && error.response.status === 429) {
                    const waitTime = Math.pow(2, retryCount) * 1000;
                    await new Promise((resolve) => setTimeout(resolve, waitTime));
                    retryCount++;
                }
                else {
                    throw new Error(`Error when making the request: ${error.message}`);
                }
            }
        }
        throw new Error(`Max retries reached for request: ${url}`);
    }
    async getEvents() {
        const startDateTime = new Date();
        startDateTime.setDate(startDateTime.getDate() + 1);
        startDateTime.setHours(0, 0, 0, 0);
        const startDateTimeFormatted = startDateTime
            .toISOString()
            .replace(/\.\d{3}Z$/, 'Z');
        const endDateTime = new Date(startDateTimeFormatted);
        endDateTime.setDate(endDateTime.getDate() + 1);
        const endDateTimeFormatted = endDateTime
            .toISOString()
            .replace(/\.\d{3}Z$/, 'Z');
        const url = `${this.baseUrl}/discovery/v2/events.json?apikey=${this.apiKey}&locale=*&city=Paris&countryCode=FR&startDateTime=${startDateTimeFormatted}&endDateTime=${endDateTimeFormatted}`;
        console.log(`Fetching events from the ${startDateTimeFormatted} to the ${endDateTimeFormatted}`);
        return await this.makeRequest(url);
    }
    async parsePageEvents(data) {
        if (!data._embedded || !data._embedded.events) {
            throw new Error('Invalid data structure');
        }
        return data._embedded.events.map((event) => {
            const venue = event._embedded?.venues?.[0];
            const venueAddress = [
                venue.address?.line1,
                venue.address?.line2,
                venue.address?.line3,
            ]
                .filter(Boolean)
                .join(', ');
            const startDate = event.dates.start.dateTBD
                ? null
                : new Date(`${event.dates.start.localDate}T${event.dates.start.localTime || '00:00:00'}`);
            const endDate = event.dates.end?.dateTBD
                ? null
                : event.dates.end?.localDate
                    ? new Date(`${event.dates.end.localDate}T${event.dates.end.localTime || '23:59:59'}`)
                    : null;
            const startDateSales = event.sales.public.startDateTime
                ? new Date(event.sales.public.startDateTime)
                : null;
            const endDateSales = event.sales.public.endDateTime
                ? new Date(event.sales.public.endDateTime)
                : null;
            const genre = [];
            for (const classification of event.classifications) {
                genre.push(classification.genre?.name);
            }
            return {
                id: event.id,
                name: event.name,
                startDate: startDate,
                endDate: endDate,
                startDateSales: startDateSales,
                endDateSales: endDateSales,
                url: event.url,
                description: event.description,
                genre: genre.join('/'),
                venueAddress: venueAddress || 'No address available',
                venueName: venue.name || 'No information',
            };
        });
    }
    async upsertEvent(event) {
        await this.database
            .insertInto('events')
            .values(event)
            .onConflict((oc) => oc.column('id').doUpdateSet({
            name: event.name,
            startDate: event.startDate,
            endDate: event.endDate,
            url: event.url,
            description: event.description,
            genre: event.genre,
            startDateSales: event.startDateSales,
            endDateSales: event.endDateSales,
            venueAddress: event.venueAddress,
            venueName: event.venueName,
        }))
            .execute();
    }
    async parseAndSaveEvents(data) {
        let nextUrl = data._links.self.href;
        while (nextUrl) {
            const pageEventsParsed = await this.parsePageEvents(data);
            for (const parsedEvent of pageEventsParsed) {
                this.upsertEvent(parsedEvent);
            }
            console.log('upserted page:', data.page.number);
            const nextLink = data._links?.next;
            if (nextLink && nextLink.href) {
                nextUrl = `${this.baseUrl}${nextLink.href}&apikey=${this.apiKey}`;
                data = await this.makeRequest(nextUrl);
            }
            else {
                nextUrl = null;
            }
        }
    }
    async getClassifications() {
        const url = `${this.baseUrl}/discovery/v2/classifications.json?apikey=${this.apiKey}`;
        console.log('Fetching classifications');
        return await this.makeRequest(url);
    }
    async parsePageClassifications(data) {
        if (!data._embedded || !data._embedded.classifications) {
            throw new Error('Invalid data structure');
        }
        const subGenreList = [];
        const genreList = [];
        data._embedded.classifications.forEach((classification) => {
            const genreId = classification.segment?.id;
            const genreName = classification.segment?.name;
            if (genreId && genreName) {
                genreList.push({ id: genreId, name: genreName });
            }
            if (classification?.segment?._embedded?.genres) {
                classification.segment._embedded.genres.forEach((subGenre) => {
                    subGenreList.push({
                        id: subGenre.id,
                        name: subGenre.name,
                        genreId: genreId,
                    });
                });
            }
        });
        return [genreList, subGenreList];
    }
    async upsertGenre(genre) {
        await this.database
            .insertInto('genres')
            .values(genre)
            .onConflict((oc) => oc.column('id').doUpdateSet({
            name: genre.name,
        }))
            .execute();
    }
    async upsertSubGenre(subGenre) {
        await this.database
            .insertInto('subgenres')
            .values(subGenre)
            .onConflict((oc) => oc.column('id').doUpdateSet({
            name: subGenre.name,
            genreId: subGenre.genreId,
        }))
            .execute();
    }
    async parseAndSaveGenresAndSubGenres(data) {
        let nextUrl = data._links.self.href;
        while (nextUrl) {
            const [pageGenresParsed, pageSubGenresParsed] = await this.parsePageClassifications(data);
            for (const parsedGenre of pageGenresParsed) {
                this.upsertGenre(parsedGenre);
            }
            for (const parsedSubGenre of pageSubGenresParsed) {
                this.upsertSubGenre(parsedSubGenre);
            }
            console.log('upserted page:', data.page.number);
            const nextLink = data._links?.next;
            if (nextLink && nextLink.href) {
                nextUrl = `${this.baseUrl}${nextLink.href}&apikey=${this.apiKey}`;
                data = await this.makeRequest(nextUrl);
            }
            else {
                nextUrl = null;
            }
        }
    }
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        database_service_1.DatabaseService])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map