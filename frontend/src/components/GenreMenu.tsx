import React from 'react';

import styles from '../styles/NavBar.module.css';

interface GenreMenuProps {
  genres: string[];
  onClose: () => void;
  onGenreClick: (genre: string) => void;
}

const GenreMenu: React.FC<GenreMenuProps> = ({
  genres,
  onClose,
  onGenreClick,
}) => {
  return (
    <div className={styles.genreMenu} onMouseLeave={onClose}>
      {genres.map((genre, index) => (
        <div
          key={index}
          className={styles.genreItem}
          onClick={(): void => onGenreClick(genre)}
        >
          {genre}
        </div>
      ))}
    </div>
  );
};

export default GenreMenu;
