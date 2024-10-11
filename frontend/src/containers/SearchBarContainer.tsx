import React, { useState } from 'react';

import SearchBar from '../components/SearchBar';

const SearchBarContainer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
      />
    </div>
  );
};

export default SearchBarContainer;
