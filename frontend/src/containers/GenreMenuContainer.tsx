import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GenreMenu from '../components/GenreMenu';
import styles from '../styles/NavBar.module.css';

const genres = ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip-Hop']; // To be fetched from backend

const GenreMenuContainer: React.FC = (): React.JSX.Element => {
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = (): void => {
    setShowGenreMenu(true);
  };

  const handleMouseLeave = (): void => {
    setShowGenreMenu(false);
  };

  const handleGenreClick = (genre: string): void => {
    navigate(`/events/${genre}`);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className={styles.navBarButton}>Genres</button>
      {showGenreMenu && (
        <GenreMenu
          onClose={handleMouseLeave}
          genres={genres}
          onGenreClick={handleGenreClick}
        />
      )}
    </div>
  );
};

export default GenreMenuContainer;
