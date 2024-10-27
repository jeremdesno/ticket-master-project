import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '../components/SearchBar';
import styles from '../styles/NavBar.module.css';

const SearchBarContainer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchTermChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Enter') {
      navigate(`events/search?query=${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <div className={styles.searchBar}>
      <SearchBar
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        onSearchSubmit={handleSearchSubmit}
      />
    </div>
  );
};

export default SearchBarContainer;
