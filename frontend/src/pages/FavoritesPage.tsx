import React, { useEffect, useState } from 'react';

import { FavoriteEventsDataModel } from '../../../backend/src/common/models';
import { fetchFavorites, removeFavorite } from '../api/favoritesService';
import EventBoxContainer from '../containers/EventBoxContainer';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/FavoritesPage.module.css';
const FavoritesPage: React.FC = (): React.JSX.Element => {
  const { userId } = useAuth() as { userId: number };
  const [favorites, setFavorites] = useState<FavoriteEventsDataModel[] | null>(
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

  if (!favorites) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.favoritesGrid}>
      {favorites.map((favorite) => (
        <EventBoxContainer
          key={favorite.eventId}
          eventId={favorite.eventId}
          onRemoveFavorite={(): void => {
            handleRemoveFavorite(favorite.eventId);
          }}
        />
      ))}
    </div>
  );
};

export default FavoritesPage;
