# ticket-master-project

## Data Integration

Command to update the postgres database with the events from tomorrow .
The time period can be changed in the integration service.
```
cd backend/
ts-node script/run-integration.ts
```

## Backend 

Run the following command tu start the postgres database :
```
cd backend/
docker-compose up --build
```
And to start the backend server run :
```
cd backend/
nest start
```

Currently this API allows you to access event data, including paginated lists of events, events filtered by date range, and specific event details. Here's a few exemples of requests that can be made :
- GET http://127.0.0.1:3000/events?limit=10&offset=0
- GET http://127.0.0.1:3000/events/rZ7SnyZ1Ad-07k
- GET http://127.0.0.1:3000/events/by-date-range?startDate=2024-10-01T00:00:00Z&endDate=2024-10-02T23:59:59Z&limit=10&offset=0

All responses are returned in JSON format. The parameters limit and offset allow for pagination, while date ranges can be specified using ISO 8601 date formats.