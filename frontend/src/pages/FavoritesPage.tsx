import React, { useEffect, useState } from 'react';

import {
  EventDataModel,
  FavoriteEventsDataModel,
} from '../../../backend/src/common/models';
import { fetchFavorites, removeFavorite } from '../api/favoritesService';
import DetailsPanel from '../components/DetailsPanel';
import EventBoxContainer from '../containers/EventBoxContainer';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/FavoritesPage.module.css';
const FavoritesPage: React.FC = (): React.JSX.Element => {
  const { userId } = useAuth() as { userId: number };
  const [favorites, setFavorites] = useState<FavoriteEventsDataModel[] | null>(
    null,
  );
  const [showPannel, setShowPannel] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDataModel | null>(
    null,
  );

  useEffect(() => {
    const loadFavorites = async (userId: number): Promise<void> => {
      const fetchedFavorites = await fetchFavorites(userId);
      setFavorites(fetchedFavorites);
    };
    loadFavorites(userId);
  }, [userId, favorites]);

  const handleRemoveFavorite = async (eventId: string): Promise<void> => {
    await removeFavorite(userId, eventId);
    setFavorites(
      (prevFavorites) =>
        prevFavorites?.filter((fav) => fav.eventId !== eventId) || null,
    );
  };

  const handleDetailsSelect = (eventData: EventDataModel): void => {
    setSelectedEvent(eventData);
    setShowPannel(true);
  };
  const handleClosePanel = (): void => {
    setShowPannel(false);
    setSelectedEvent(null);
  };

  if (!favorites) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className={styles.favoritesGrid}>
        {favorites.map((favorite) => (
          <EventBoxContainer
            key={favorite.eventId}
            eventId={favorite.eventId}
            onRemoveFavorite={(): void => {
              handleRemoveFavorite(favorite.eventId);
            }}
            onDetailsSelect={handleDetailsSelect}
          />
        ))}
      </div>
      {selectedEvent && (
        <DetailsPanel
          isOpen={showPannel}
          onClose={handleClosePanel}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
