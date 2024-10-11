import React from 'react';

import styles from '../styles/NavBar.module.css';

const HomeButton: React.FC = (): React.JSX.Element => {
  const handleClick = (): void => {
    console.log('Go to home');
  };

  return (
    <button className={styles.navBarButton} onClick={handleClick}>
      Home
    </button>
  );
};

export default HomeButton;
