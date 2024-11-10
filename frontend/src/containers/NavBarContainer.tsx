import React from 'react';
import { useNavigate } from 'react-router-dom';

import GenreMenuContainer from './GenreMenuContainer';
import SearchBarContainer from './SearchBarContainer';
import { logout } from '../api/authService';
import NavButton from '../components/NavButton';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/layout/NavBar.module.css';

const NavBarContainer: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuth();
  const handleNavigation = (path: string) => () => {
    navigate(path);
  };

  const handleLogoutClick = async (): Promise<void> => {
    await logout();
    await checkAuth();
    navigate('/');
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSectionNavBar}>
        <NavButton label="Home" onClick={handleNavigation('/home')} />
        <NavButton label="Favorites" onClick={handleNavigation('/favorites')} />
        <GenreMenuContainer />
      </div>
      <div className={styles.rightSectionNavBar}>
        <SearchBarContainer />
        {isAuthenticated ? (
          <NavButton label="Logout" onClick={handleLogoutClick} />
        ) : (
          <NavButton label="Login" onClick={handleNavigation('/')} />
        )}
      </div>
    </nav>
  );
};

export default NavBarContainer;
