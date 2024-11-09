import React from 'react';

import styles from '../styles/components/NavButton.module.css';

interface NavButtonProps {
  label: string;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, onClick }) => {
  return (
    <button className={styles.navBarButton} onClick={onClick}>
      {label}
    </button>
  );
};

export default NavButton;
