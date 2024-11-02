import React from 'react';

import EventCardContainer from './EventCardContainer';
import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';

interface EventsGridProps {
  events: EventDataModel[] | EventSearchResult[];
  sessions: { [key: string]: EventSessionDataModel };
  className?: string;
}

const eventsGridDefaultStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  padding: '20px 40px',
};

const EventsGridContainer: React.FC<EventsGridProps> = ({
  events,
  sessions,
  className,
}) => {
  return (
    <div
      className={className}
      style={!className ? eventsGridDefaultStyle : undefined}
    >
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
