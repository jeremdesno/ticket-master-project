import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchPageResultContainer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  return (
    <div>
      <h1>Search Results for: {query}</h1>
    </div>
  );
};

export default SearchPageResultContainer;