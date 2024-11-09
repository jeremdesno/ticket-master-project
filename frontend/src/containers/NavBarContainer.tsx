import React from 'react';
import { useNavigate } from 'react-router-dom';

import GenreMenuContainer from './GenreMenuContainer';
import SearchBarContainer from './SearchBarContainer';
import NavButton from '../components/NavButton';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/layout/NavBar.module.css';

const NavBarContainer: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const handleNavigation = (path: string) => () => {
    navigate(path);
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
          <NavButton label="Logout" onClick={handleNavigation('/logout')} />
        ) : (
          <NavButton label="Login" onClick={handleNavigation('/login')} />
        )}
      </div>
    </nav>
  );
};

export default NavBarContainer;
