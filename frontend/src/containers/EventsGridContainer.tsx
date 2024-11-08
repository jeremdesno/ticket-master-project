import React from 'react';

import EventCardContainer from './EventCardContainer';
import { EventDataModel } from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';

interface EventsGridProps {
  events: EventDataModel[] | EventSearchResult[];
  startDate?: Date;
  endDate?: Date;
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
  startDate,
  endDate,
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
          startDate={startDate}
          endDate={endDate}
        />
      ))}
    </div>
  );
};

export default EventsGridContainer;
