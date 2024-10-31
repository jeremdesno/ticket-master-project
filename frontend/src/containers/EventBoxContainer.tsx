import React, { useEffect, useState } from 'react';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { fetchEvent, fetchEventSessions } from '../api/eventService';
import EventBox from '../components/EventBox';

interface EventBoxProps {
  eventId: string;
  onRemoveFavorite: () => void;
  onDetailsSelect: (
    eventData: EventDataModel,
    sessions: EventSessionDataModel[],
  ) => void;
}

const EventBoxContainer: React.FC<EventBoxProps> = ({
  eventId,
  onRemoveFavorite,
  onDetailsSelect,
}): JSX.Element => {
  const [event, setEvent] = useState<EventDataModel | null>(null);
  const [sessions, setSessions] = useState<EventSessionDataModel[] | null>(
    null,
  );

  useEffect(() => {
    const loadEventData = async (eventId: string): Promise<void> => {
      try {
        const fetchedEvent = await fetchEvent(eventId);
        const fetchedSessions = await fetchEventSessions(eventId);
        setEvent(fetchedEvent);
        setSessions(fetchedSessions);
      } catch (error) {
        console.log('Failed to fetch event: ', error);
      }
    };
    loadEventData(eventId);
  }, [eventId]);

  if (!event || !sessions) {
    return <div>Loading...</div>;
  }
  return (
    <EventBox
      event={event}
      earliestSession={sessions[0]}
      onDetailsClick={(): void => {
        onDetailsSelect(event, sessions);
      }}
      onFavoriteClick={onRemoveFavorite}
    />
  );
};

export default EventBoxContainer;
