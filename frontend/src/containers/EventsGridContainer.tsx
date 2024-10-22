import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';
import EventCard from '../components/EventCard';
import styles from '../styles/GenrePage.module.css';

interface EventsGridProps {
  events: EventDataModel[] | EventSearchResult[];
  sessions: { [key: string]: EventSessionDataModel };
}

const EventsGridContainer: React.FC<EventsGridProps> = ({
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

export default EventsGridContainer;
