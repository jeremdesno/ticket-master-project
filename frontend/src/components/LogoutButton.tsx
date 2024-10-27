import React from 'react';

import styles from '../styles/NavBar.module.css';


interface LogoutButtonProps {
    onLogoutClick: () => void;
}
const LogoutButton: React.FC<LogoutButtonProps> = ({
    onLogoutClick
}): React.JSX.Element => {
  return (
    <button className={styles.navBarButton} onClick={onLogoutClick}>
      Logout
    </button>
  );
};

export default LogoutButton;