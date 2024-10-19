import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import EventCard from '../components/EventCard';
import styles from '../styles/GenrePage.module.css';

interface GenreEventsGridProps {
  events: EventDataModel[];
  sessions: { [key: string]: EventSessionDataModel };
}

const GenreEventsGridContainer: React.FC<GenreEventsGridProps> = ({
  events,
  sessions,
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
          earliestSession={sessions[event.id]}
          onDetailsClick={(): void => {
            handleDetailsClick(event.id);
          }}
        />
      ))}
    </div>
  );
};

export default GenreEventsGridContainer;
