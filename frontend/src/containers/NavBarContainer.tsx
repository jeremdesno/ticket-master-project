import React from 'react';

import GenreMenuContainer from './GenreMenuContainer';
import SearchBarContainer from './SearchBarContainer';
import FavoritesButton from '../components/FavoritesButton';
import HomeButton from '../components/HomeButton';
import styles from '../styles/NavBar.module.css';

const NavBarContainer: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <HomeButton />
      <FavoritesButton />
      <GenreMenuContainer />
      <SearchBarContainer />
    </nav>
  );
};

export default NavBarContainer;
