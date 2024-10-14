import React from 'react';

import EventCard from '../components/EventCard';
import { EventDataModel } from '../../../backend/src/common/models';
import styles from '../styles/GenrePage.module.css';
import { useNavigate } from 'react-router-dom';

interface GenreEventsGridProps {
  events: EventDataModel[];
}

const GenreEventsGridContainer: React.FC<GenreEventsGridProps> = ({
  events,
}) => {
  return (
    <div className={styles.eventsGrid}>
      {events.map((event) => (
        <EventCard
          event={event}
        />
      ))}
    </div>
  );
};

export default GenreEventsGridContainer;
