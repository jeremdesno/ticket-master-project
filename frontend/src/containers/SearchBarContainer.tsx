import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '../components/SearchBar';

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
    <SearchBar
      searchTerm={searchTerm}
      onSearchTermChange={handleSearchTermChange}
      onSearchSubmit={handleSearchSubmit}
    />
  );
};

export default SearchBarContainer;
