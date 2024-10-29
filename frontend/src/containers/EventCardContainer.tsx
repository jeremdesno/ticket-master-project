import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';
import {
  addFavorite,
  fetchFavoriteStatus,
  removeFavorite,
} from '../api/favoritesService';
import EventCard from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';

interface EventCardProps {
  event: EventDataModel | EventSearchResult;
  session: EventSessionDataModel;
}

const EventCardContainer: React.FC<EventCardProps> = ({
  event,
  session,
}): JSX.Element => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const navigate = useNavigate();
  const { userId } = useAuth() as { userId: number };

  useEffect(() => {
    const setFavoriteState = async (userId: number, eventId: string): Promise<void> => {
      try {
        const status = await fetchFavoriteStatus(userId, eventId);
        setIsFavorite(status);
      } catch (error) {
        console.error('Failed to fetch event favorite status:', error);
      }
    };
    setFavoriteState(userId, event.id);
  }, []);

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

  return (
    <EventCard
      event={event}
      earliestSession={session}
      onDetailsClick={handleDetailsClick}
      isFavorite={isFavorite}
      onFavoriteClick={handleFavoriteClick}
    />
  );
};

export default EventCardContainer;
