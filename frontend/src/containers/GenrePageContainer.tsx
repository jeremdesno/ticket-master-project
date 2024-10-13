import React from 'react';
import { useParams } from 'react-router-dom';

import { EventDataModel } from '../../../backend/src/common/models';
import GenreEventsGrid from '../components/GenreEventsGrid';
import styles from '../styles/GenrePage.module.css';

// Generate 10 fake events as placeholders
const events: EventDataModel[] = Array.from({ length: 10 }, (_, index) => ({
  id: String(index + 1),
  name: `Event ${index + 1}`,
  startDate: new Date(`2024-07-${index + 10}`),
  endDate: new Date(`2024-07-${index + 12}`),
  url: `https://event${index + 1}.com`,
  description: `This is the description for Event ${index + 1}`,
  genre: index % 2 === 0 ? 'Rock' : 'Pop',
  startDateSales: new Date('2024-01-01'),
  endDateSales: new Date('2024-07-01'),
  venueAddress: `${index + 1} Venue St.`,
  venueName: `Venue ${index + 1}`,
}));

const EventsPageContainer: React.FC = (): React.JSX.Element => {
  const { genre } = useParams<{ genre: string }>();

  return (
    <div>
      <h1 className={styles.genreTitle}>{genre} Events</h1>
      <GenreEventsGrid events={events} />
    </div>
  );
};

export default EventsPageContainer;
