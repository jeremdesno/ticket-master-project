import React from 'react';
import { useNavigate } from 'react-router-dom';

import GenreMenuContainer from './GenreMenuContainer';
import SearchBarContainer from './SearchBarContainer';
import { logout } from '../api/authService';
import FavoritesButton from '../components/FavoritesButton';
import HomeButton from '../components/HomeButton';
import LogoutButton from '../components/LogoutButton';
import styles from '../styles/NavBar.module.css';

const NavBarContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoutClick = (): void => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSectionNavBar}>
        <HomeButton />
        <FavoritesButton />
        <GenreMenuContainer />
      </div>
      <div className={styles.rightSectionNavBar}>
        <SearchBarContainer />
        <LogoutButton onLogoutClick={handleLogoutClick} />
      </div>
    </nav>
  );
};

export default NavBarContainer;
