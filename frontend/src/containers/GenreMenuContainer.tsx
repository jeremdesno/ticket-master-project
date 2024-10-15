import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GenreDataModel } from '../../../backend/src/common/models';
import { fetchGenres } from '../api/genreService';
import GenreMenu from '../components/GenreMenu';
import styles from '../styles/NavBar.module.css';

const GenreMenuContainer: React.FC = (): React.JSX.Element => {
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const [genres, setGenres] = useState<GenreDataModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGenres = async (): Promise<void> => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    loadGenres();
  }, []);

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
