import React from 'react';

import styles from '../styles/components/SearchBar.module.css';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: React.ChangeEventHandler<HTMLInputElement>;
  onSearchSubmit: React.KeyboardEventHandler<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onSearchSubmit,
}) => {
  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchBarInput}
        type="text"
        placeholder="Search events or venues..."
        value={searchTerm}
        onChange={onSearchTermChange}
        onKeyDown={onSearchSubmit}
      />
    </div>
  );
};

export default SearchBar;
