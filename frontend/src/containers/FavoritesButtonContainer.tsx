import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import styles from '../styles/NavBar.module.css';

const FavoritesButtonContainer: React.FC = (): React.JSX.Element => {
  const navigate = useNavigate();
  const handleFavoritesClick = (): void => {
    navigate('/favorites');
  };

  return (
    <Button
      className={styles.navBarButton}
      label="Favorites"
      onClick={handleFavoritesClick}
    />
  );
};

export default FavoritesButtonContainer;
