import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';
import { fetchEventSessions } from '../api/eventService';
import {
  addFavorite,
  fetchFavoriteStatus,
  removeFavorite,
} from '../api/favoritesService';
import EventCard from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';

interface EventCardProps {
  event: EventDataModel | EventSearchResult;
  startDate?: Date;
  endDate?: Date;
}

const EventCardContainer: React.FC<EventCardProps> = ({
  event,
  startDate,
  endDate,
}): JSX.Element => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [earliestSession, setEarliestSession] =
    useState<EventSessionDataModel | null>(null);
  const navigate = useNavigate();
  const { userId } = useAuth() as { userId: number };

  useEffect(() => {
    const setFavoriteState = async (
      userId: number,
      eventId: string,
    ): Promise<void> => {
      try {
        const status = await fetchFavoriteStatus(userId, eventId);
        setIsFavorite(status);
      } catch (error) {
        console.error('Failed to fetch event favorite status:', error);
      }
    };
    setFavoriteState(userId, event.id);
  }, []);

  useEffect(() => {
    const loadEarliestSession = async (
      eventId: string,
      startDate?: Date,
      endDate?: Date,
    ): Promise<void> => {
      const fetchedSession = await fetchEventSessions(
        eventId,
        1,
        startDate ? startDate.toISOString() : undefined,
        endDate ? endDate.toISOString() : undefined,
      );
      setEarliestSession(fetchedSession[0]);
    };
    loadEarliestSession(event.id, startDate, endDate);
  }, [event]);

  const handleDetailsClick = (): void => {
    navigate(`/event/${event.id}`);
  };
  const handleFavoriteClick = async (): Promise<void> => {
    if (!isFavorite) {
      await addFavorite(userId, event.id);
    } else {
      await removeFavorite(userId, event.id);
    }
    setIsFavorite(!isFavorite);
  };
  if (!event || !earliestSession) {
    return <div>Loading...</div>;
  }
  return (
    <EventCard
      event={event}
      earliestSession={earliestSession}
      onDetailsClick={handleDetailsClick}
      isFavorite={isFavorite}
      onFavoriteClick={handleFavoriteClick}
    />
  );
};

export default EventCardContainer;
