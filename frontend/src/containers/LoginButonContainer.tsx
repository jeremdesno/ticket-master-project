import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import styles from '../styles/NavBar.module.css';

const LoginButtonContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = async (): Promise<void> => {
    navigate('/');
  };
  return (
    <Button
      className={styles.navBarButton}
      label="Login"
      onClick={handleLoginClick}
    />
  );
};

export default LoginButtonContainer;
