# ticket-master-project

## Data Integration

Command to update the postgres database with the events from tomorrow. 
The events images are sent to imgBB and we only store the url associated in the events table. 
The time period can be changed in the integration service.
```
cd backend/
ts-node scripts/run-events-integration.ts
```

To update the genres and subgenres tables run the following command:
```
ts-node scripts/run-genres-integration.ts
```

NB: The genres corresponds to the classification levels of the ticketmaster API and the subgenres to the genres.


## Backend 

The backend was build using Nest.js and typescript and stores data in a postgresql database.
Make sure you're located in the backend folder before running the following commands.
Run the following command tu start the postgres database :
```
docker-compose up --build
```
And to start the backend server run :
```
nest start
```

Currently this API allows you to access event data, including paginated lists of events that can be filtered by date range and genre, as well as specific event details for a given event id. Here's a few exemples of requests that can be made :
- GET http://127.0.0.1:3000/events?limit=10&offset=0
- GET http://127.0.0.1:3000/events/rZ7SnyZ1Ad-07k
- GET http://127.0.0.1:3000/events?startDate=2024-10-01T00:00:00Z&endDate=2024-10-02T23:59:59Z&limit=10&offset=0

All responses are returned in JSON format. The parameters limit and offset allow for pagination, while date ranges can be specified using ISO 8601 date formats.

## Frontend

The frontend is built in react, with TypeScript for static typing.
Moove to the frontend folder and run the following command to launch the app:
```
npm start
```