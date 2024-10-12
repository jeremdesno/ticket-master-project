import React from 'react';

import GenreSection from '../components/GenreSection';

const genres = ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip-Hop'];

// Sample placeholder events to be fetched from API
const placeholderEvents = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  name: `Event ${index + 1}`,
}));

const HomePageContainer: React.FC = (): JSX.Element => {
  return (
    <div>
      {genres.map((genre, index) => (
        <GenreSection
          key={genre}
          genre={genre}
          events={placeholderEvents}
          autoplayDirection={index % 2 === 0 ? 'rtl' : 'ltr'}
        />
      ))}
    </div>
  );
};

export default HomePageContainer;
