import React from 'react';

import FavoritesButtonContainer from './FavoritesButtonContainer';
import GenreMenuContainer from './GenreMenuContainer';
import HomeButtonContainer from './HomeButtonContainer';
import LoginButtonContainer from './LoginButonContainer';
import LogoutButtonContainer from './LogoutButtonContainer';
import SearchBarContainer from './SearchBarContainer';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/NavBar.module.css';

const NavBarContainer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSectionNavBar}>
        <HomeButtonContainer />
        <FavoritesButtonContainer />
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
