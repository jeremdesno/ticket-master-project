import React from 'react';

import styles from '../styles/NavBar.module.css';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
}) => {
  return (
    <input
      className={styles.searchBar}
      type="text"
      placeholder="Search events..."
      value={searchTerm}
      onChange={onSearchTermChange}
    />
  );
};

export default SearchBar;
