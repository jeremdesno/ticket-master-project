import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import FiltersContainer from './FiltersContainer';
import GenreEventsGridContainer from './GenreEventsGridContainer';
import { ExtractedEventDataModel } from '../../../backend/src/common/models';
import { fetchEvents } from '../api/eventService';
import { fetchGenres } from '../api/genreService';
import styles from '../styles/GenrePage.module.css';

const EventsPageContainer: React.FC = (): React.JSX.Element => {
  const { genre, startDate, endDate } = useParams<{
    genre: string;
    startDate?: string;
    endDate?: string;
  }>() as { genre: string; startDate?: string; endDate?: string };

  const [genres, setGenres] = useState<string[]>([]);
  const [events, setEvents] = useState<ExtractedEventDataModel[]>([]);

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
    const loadEvents = async (): Promise<void> => {
      try {
        const fetchedEvents = await fetchEvents(genre, startDate, endDate);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    loadEvents();
  }, [genre, startDate, endDate]);

  const currentStartDate = startDate ? new Date(startDate) : null;
  const currentEndDate = endDate ? new Date(endDate) : null;

  return (
    <div>
      <h1 className={styles.genreTitle}>{genre} Events</h1>
      <div className={styles.eventsPageLayout}>
        <GenreEventsGridContainer events={events} />
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
