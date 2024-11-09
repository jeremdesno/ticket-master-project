import React from 'react';

import styles from '../styles/components/GenreFilter.module.css';

interface GenreFilterProps {
  handleDropdowntoggle: () => void;
  isDropdownOpen: boolean;
  genres: string[];
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  handleDropdowntoggle,
  isDropdownOpen,
  genres,
  selectedGenre,
  onGenreSelect,
}) => {
  return (
    <div className={styles.genreFilter}>
      <button
        onClick={handleDropdowntoggle}
        className={styles.genreDropdownButton}
      >
        {selectedGenre || 'Select Genre'}
        <span className={styles.genreDropdownArrow}>
          {isDropdownOpen ? '▲' : '▼'}
        </span>
      </button>
      {isDropdownOpen && (
        <div className={styles.genreDropdownMenu}>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={(): void => onGenreSelect(genre)}
              className={`${styles.genreItem} ${
                selectedGenre === genre ? styles.genreSelected : ''
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreFilter;
