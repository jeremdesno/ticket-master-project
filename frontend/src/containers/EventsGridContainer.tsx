import React from 'react';

import EventCardContainer from './EventCardContainer';
import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';
import styles from '../styles/GenrePage.module.css';

interface EventsGridProps {
  events: EventDataModel[] | EventSearchResult[];
  sessions: { [key: string]: EventSessionDataModel };
}

const EventsGridContainer: React.FC<EventsGridProps> = ({
  events,
  sessions,
}) => {
  return (
    <div className={styles.eventsGrid}>
      {events.map((event) => (
        <EventCardContainer
          key={event.id}
          event={event}
          session={sessions[event.id]}
        />
      ))}
    </div>
  );
};

export default EventsGridContainer;
