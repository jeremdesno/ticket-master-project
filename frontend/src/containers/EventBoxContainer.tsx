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
}

const EventBoxContainer: React.FC<EventBoxProps> = ({
  eventId,
  onRemoveFavorite,
}): JSX.Element => {
  const [event, setEvent] = useState<EventDataModel | null>(null);
  const [session, setSession] = useState<EventSessionDataModel | null>(null);

  useEffect(() => {
    const loadEventData = async (eventId: string): Promise<void> => {
      try {
        const fetchedEvent = await fetchEvent(eventId);
        const fetchedSession = await fetchEventSessions(eventId, 1);
        setEvent(fetchedEvent);
        setSession(fetchedSession[0]);
      } catch (error) {
        console.log('Failed to fetch event: ', error);
      }
    };
    loadEventData(eventId);
  }, [eventId]);

  const handleDetailsClick = (): void => {
    console.log('show details');
  };
  if (!event || !session) {
    return <div>Loading...</div>;
  }
  return (
    <EventBox
      event={event}
      earliestSession={session}
      onDetailsClick={handleDetailsClick}
      onFavoriteClick={onRemoveFavorite}
    />
  );
};

export default EventBoxContainer;
