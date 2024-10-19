import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import FiltersContainer from './FiltersContainer';
import GenreEventsGridContainer from './GenreEventsGridContainer';
import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { fetchEvents, fetchEventSessions } from '../api/eventService';
import { fetchGenres } from '../api/genreService';
import styles from '../styles/GenrePage.module.css';

const EventsPageContainer: React.FC = (): React.JSX.Element => {
  const { genre, startDate, endDate } = useParams<{
    genre: string;
    startDate?: string;
    endDate?: string;
  }>() as { genre: string; startDate?: string; endDate?: string };

  const [genres, setGenres] = useState<string[]>([]);
  const [events, setEvents] = useState<EventDataModel[]>([]);
  const [sessions, setSessions] = useState<{
    [key: string]: EventSessionDataModel;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadGenres = async (): Promise<void> => {
      try {
        const fetchedGenres = await fetchGenres();
        const genreNames = fetchedGenres.map((genre) => genre.name);
        setGenres(genreNames);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const loadEventsAndSessions = async (): Promise<void> => {
      setLoading(true);
      try {
        const fetchedEvents = await fetchEvents(genre, startDate, endDate);
        setEvents(fetchedEvents);

        const sessionsMap: { [key: string]: EventSessionDataModel } = {};

        await Promise.all(
          fetchedEvents.map(async (event) => {
            try {
              const fetchedSessions = await fetchEventSessions(event.id, 1);
              sessionsMap[event.id] = fetchedSessions[0];
            } catch (error) {
              console.error(
                `Failed to fetch sessions for event ${event.id}:`,
                error,
              );
            }
          }),
        );

        setSessions(sessionsMap);
      } catch (error) {
        console.error('Failed to fetch events or sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEventsAndSessions();
  }, [genre, startDate, endDate]);

  const currentStartDate = startDate ? new Date(startDate) : null;
  const currentEndDate = endDate ? new Date(endDate) : null;

  if (loading) {
    return <div></div>;
  }

  if (!events.length || Object.keys(sessions).length === 0) {
    return <div>No available events for this genre...</div>;
  }

  return (
    <div>
      <h1 className={styles.genreTitle}>{genre} Events</h1>
      <div className={styles.eventsPageLayout}>
        <GenreEventsGridContainer events={events} sessions={sessions} />
        <FiltersContainer
          genres={genres}
          currentGenre={genre}
          currentStartDate={currentStartDate}
          currentEndDate={currentEndDate}
        />
      </div>
    </div>
  );
};

export default EventsPageContainer;
