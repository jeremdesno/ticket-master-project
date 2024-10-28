import React from 'react';

import GenreMenuContainer from './GenreMenuContainer';
import LoginButtonContainer from './LoginButonContainer';
import LogoutButtonContainer from './LogoutButtonContainer';
import SearchBarContainer from './SearchBarContainer';
import FavoritesButton from '../components/FavoritesButton';
import HomeButton from '../components/HomeButton';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/NavBar.module.css';

const NavBarContainer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSectionNavBar}>
        <HomeButton />
        <FavoritesButton />
        <GenreMenuContainer />
      </div>
      <div className={styles.rightSectionNavBar}>
        <SearchBarContainer />
        {isAuthenticated ? <LogoutButtonContainer /> : <LoginButtonContainer />}
      </div>
    </nav>
  );
};

export default NavBarContainer;
