import React from 'react';

import GenreMenuContainer from './GenreMenuContainer';
import SearchBarContainer from './SearchBarContainer';
import FavoritesButton from '../components/FavoritesButton';
import HomeButton from '../components/HomeButton';
import styles from '../styles/NavBar.module.css';

const NavBarContainer: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSectionNavBar}>
        <HomeButton />
        <FavoritesButton />
        <GenreMenuContainer />
      </div>
      <SearchBarContainer />
    </nav>
  );
};

export default NavBarContainer;
