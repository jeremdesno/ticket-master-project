import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/NavBar.module.css';

const HomeButton: React.FC = (): React.JSX.Element => {
  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate('/');
  };

  return (
    <button className={styles.navBarButton} onClick={handleClick}>
      Home
    </button>
  );
};

export default HomeButton;
