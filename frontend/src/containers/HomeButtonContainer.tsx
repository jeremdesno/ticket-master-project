import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import styles from '../styles/NavBar.module.css';

const HomeButtonContainer: React.FC = (): React.JSX.Element => {
  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate('/home');
  };

  return (
    <Button
      className={styles.navBarButton}
      label="Home"
      onClick={handleClick}
    ></Button>
  );
};

export default HomeButtonContainer;
