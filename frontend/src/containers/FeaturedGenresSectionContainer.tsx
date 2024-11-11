import React, { useEffect, useState } from 'react';

import { GenreDataModel } from '../../../backend/src/common/models';
import { fetchGenres } from '../api/genreService';
import ImageSection from '../components/ImageSection';
import { genreImagesPaths } from '../constants/genres';
import styles from '../styles/components/FeaturedGenresSection.module.css';

const FeaturedGenresSectionContainer: React.FC = (): JSX.Element => {
  const [genres, setGenres] = useState<GenreDataModel[] | null>(null);

  useEffect(() => {
    const loadGenres = async (): Promise<void> => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.log('Failed to load genres:', error);
      }
    };
    loadGenres();
  }, []);
  if (!genres) {
    return <div>Loading genres...</div>;
  }
  return (
    <ImageSection
      images={genres
        .filter((genre) => genre.id in genreImagesPaths)
        .map((genre) => {
          return {
            imageUrl: genreImagesPaths[genre.id],
            id: genre.id,
          };
        })}
      styles={{
        imagesLayoutContainer: styles.verticalStack,
        imageContainer: styles.genreImage,
      }}
    />
  );
};

export default FeaturedGenresSectionContainer;
