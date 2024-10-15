import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import FiltersContainer from './FiltersContainer';
import GenreEventsGridContainer from './GenreEventsGridContainer';
import { EventDataModel } from '../../../backend/src/common/models';
import { fetchGenres } from '../api/genreService';
import styles from '../styles/GenrePage.module.css';

// Generate 10 fake events as placeholders
const events: EventDataModel[] = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  name: `Event ${index + 1}`,
  startDate: new Date(`2024-07-${index + 10}`),
  endDate: new Date(`2024-07-${index + 12}`),
  url: `https://event${index + 1}.com`,
  description: `This is the description for Event ${index + 1}`,
  genre: index % 2 === 0 ? 'Sports' : 'Film',
  startDateSales: new Date('2024-01-01'),
  endDateSales: new Date('2024-07-01'),
  venueAddress: `${index + 1} Venue St.`,
  venueName: `Venue ${index + 1}`,
}));

const EventsPageContainer: React.FC = (): React.JSX.Element => {
  const { genre, startDate, endDate } = useParams<{
    genre: string;
    startDate?: string;
    endDate?: string;
  }>() as { genre: string; startDate?: string; endDate?: string };

  const [genres, setGenres] = useState<string[]>([]);
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

  const currentStartDate = startDate ? new Date(startDate) : null;
  const currentEndDate = endDate ? new Date(endDate) : null;

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return (
      (!genre || event.genre === genre) &&
      (!currentStartDate || eventDate >= currentStartDate) &&
      (!currentEndDate || eventDate <= currentEndDate)
    );
  });

  return (
    <div>
      <h1 className={styles.genreTitle}>{genre} Events</h1>
      <div className={styles.eventsPageLayout}>
        <GenreEventsGridContainer events={filteredEvents} />
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
