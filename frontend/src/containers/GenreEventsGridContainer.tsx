import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ExtractedEventDataModel } from '../../../backend/src/common/models';
import EventCard from '../components/EventCard';
import styles from '../styles/GenrePage.module.css';

interface GenreEventsGridProps {
  events: ExtractedEventDataModel[];
}

const GenreEventsGridContainer: React.FC<GenreEventsGridProps> = ({
  events,
}) => {
  const navigate = useNavigate();
  const handleDetailsClick = (eventId: string): void => {
    navigate(`/event/${eventId}`);
  };
  return (
    <div className={styles.eventsGrid}>
      {events.map((event) => (
        <EventCard
          event={event}
          onDetailsClick={(): void => {
            handleDetailsClick(event.id);
          }}
        />
      ))}
    </div>
  );
};

export default GenreEventsGridContainer;
