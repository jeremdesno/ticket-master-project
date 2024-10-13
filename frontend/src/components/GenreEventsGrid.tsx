import React from 'react';

import EventCard from './EventCard';
import { EventDataModel } from '../../../backend/src/common/models';
import styles from '../styles/GenrePage.module.css';

interface GenreEventsGridProps {
  events: EventDataModel[];
}

const GenreEventsGrid: React.FC<GenreEventsGridProps> = ({ events }) => {
  return (
    <div className={styles.eventsGrid}>
      {events.map((event) => (
        <EventCard event={event} />
      ))}
    </div>
  );
};

export default GenreEventsGrid;
