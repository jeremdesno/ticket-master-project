import React, { useEffect, useState } from 'react';

import { GenreDataModel } from '../../../backend/src/common/models';
import { fetchGenres } from '../api/genreService';
import GenreSectionContainer from '../containers/GenreSectionContainer';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = (): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const [genres, setGenres] = useState<GenreDataModel[]>([]);

  useEffect(() => {
    const loadGenres = async (): Promise<void> => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    loadGenres();
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <>
          {genres.length === 0 ? (
            <p>Loading genres...</p>
          ) : (
            genres.map((genre, index) => (
              <GenreSectionContainer genre={genre.name} index={index} />
            ))
          )}
        </>
      ) : (
        <p>Please log in to see the events.</p>
      )}
    </div>
  );
};

export default HomePage;
