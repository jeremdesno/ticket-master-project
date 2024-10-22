# ticket-master-project

## Data Model 

This project uses a postgresql database to store data.
The events data is handled by three tables :
- extractedEvents : contains 'Raw' data and has all details about a specifique event's session
- events : contains generique data (name, venue, image ...) that is relevant to all sessions of an event.  
- eventSessions : contains details (dates, url ...) about a specific session of an event.

The genres and subgenres have their own dedicated tables. 

The search is handled by a single node elasticsearch cluster that indexes events, and enables fuzzy search on the venue name and event name.

## Data Integration

The events integration process has 2 layers, first the ingestion of the ticketmaster events in the extractedEvents table. 
Then we have a transformation layer that syncs the new extracted events to the eventSessions and events tables.
The events images are sent to imgBB and we only store the url associated in the events table. 
The processing of images happens in the syncing stage of the events, to limit the number of api calls to imgBB.

To update the extractedEvents table with the events from tomorrow run the following commands : 
```
cd backend/
ts-node scripts/run-events-integration.ts
```
The time period can be changed in the integration service.

Then run the following command to sync the data to the events and eventSessions tables aswell as to the elasticsearch index:
```
ts-node scripts/sync-events-and-sessions.ts
```

To update the genres and subgenres tables run the following command:
```
ts-node scripts/run-genres-integration.ts
```

NB_1: Make sure to start the postgresql and elasticsearch instances before running these commands.

NB_2: The genres corresponds to the classification levels of the ticketmaster API and the subgenres to the genres.

## Backend 

The backend was build using Nest.js and typescript.
Make sure you're located in the backend folder before running the following commands.
Run the following command tu start the postgres database and the elasticsearch instance :
```
docker-compose up --build
```
This also starts a pg admin service and a kibana service to visualise and interact with the data in both our database and elasticsearch instance.

And to start the backend server run :
```
nest start
```

Currently this API allows you to access event data, including paginated lists of events that can be filtered by date range and genre, as well as specific event details or sessions for a given event id. It also exposes an endpoint to search events and venues and provides pagination.
Here's a few exemples of requests that can be made :
- GET http://127.0.0.1:3000/events?limit=10&offset=0
- GET http://127.0.0.1:3000/events/rZ7SnyZ1Ad-07k
- GET http://127.0.0.1:3000/events?startDate=2024-10-01T00:00:00Z&endDate=2024-10-02T23:59:59Z&limit=10&offset=0
- GET http://127.0.0.1:3000/search?query=arena

All responses are returned in JSON format.

## Frontend

The frontend is built in react, with TypeScript for static typing.
Moove to the frontend folder and run the following command to launch the app:
```
npm start
```