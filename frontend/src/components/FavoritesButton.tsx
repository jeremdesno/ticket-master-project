import React from 'react';

import styles from '../styles/NavBar.module.css';

const FavoritesButton: React.FC = (): React.JSX.Element => {
  const handleClick = (): void => {
    console.log('Show favorites');
  };

  return (
    <button className={styles.navBarButton} onClick={handleClick}>
      Favorites
    </button>
  );
};

export default FavoritesButton;
