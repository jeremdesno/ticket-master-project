import React from 'react';
import { useNavigate } from 'react-router-dom';

import { logout } from '../api/authService';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/NavBar.module.css';

const LogoutButtonContainer: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleLogoutClick = async (): Promise<void> => {
    await logout();
    await checkAuth();
    navigate('/');
  };
  return (
    <Button
      className={styles.navBarButton}
      label="Logout"
      onClick={handleLogoutClick}
    />
  );
};

export default LogoutButtonContainer;
