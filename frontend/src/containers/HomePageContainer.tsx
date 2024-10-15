import React, { useEffect, useState } from 'react';

import { GenreDataModel } from '../../../backend/src/common/models';
import { fetchGenres } from '../api/genreService';
import GenreSection from '../components/GenreSection';

// Sample placeholder events to be fetched from API
const placeholderEvents = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  name: `Event ${index + 1}`,
}));

const HomePageContainer: React.FC = (): JSX.Element => {
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
      {genres.map((genre, index) => (
        <GenreSection
          key={genre.id}
          genre={genre.name}
          events={placeholderEvents}
          autoplayDirection={index % 2 === 0 ? 'rtl' : 'ltr'}
        />
      ))}
    </div>
  );
};

export default HomePageContainer;
