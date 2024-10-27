import React from 'react';

import styles from '../styles/NavBar.module.css';

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
    <input
      className={styles.searchBarInput}
      type="text"
      placeholder="Search events or venues..."
      value={searchTerm}
      onChange={onSearchTermChange}
      onKeyDown={onSearchSubmit}
    />
  );
};

export default SearchBar;
