import React from 'react';

import { GenreDataModel } from '../../../backend/src/common/models';
import styles from '../styles/components/GenreMenu.module.css';

interface GenreMenuProps {
  genres: GenreDataModel[];
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
          onClick={(): void => onGenreClick(genre.name)}
        >
          {genre.name}
        </div>
      ))}
    </div>
  );
};

export default GenreMenu;
