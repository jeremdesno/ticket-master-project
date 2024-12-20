import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GenreDataModel } from '../../../backend/src/common/models';
import { fetchGenres } from '../api/genreService';
import ImageSection from '../components/ImageSection';
import { genreImagesPaths } from '../constants/genres';
import styles from '../styles/components/FeaturedGenresSection.module.css';

const FeaturedGenresSectionContainer: React.FC = (): JSX.Element => {
  const [genres, setGenres] = useState<GenreDataModel[] | null>(null);
  const [genreMapping, setGenreMapping] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadGenres = async (): Promise<void> => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
        const genreMap: Record<string, string> = fetchedGenres.reduce(
          (acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          },
          {} as Record<string, string>,
        );

        setGenreMapping(genreMap);
      } catch (error) {
        console.log('Failed to load genres:', error);
      }
    };
    loadGenres();
  }, []);

  const handleGenreClick = (id: string): void => {
    navigate(`/events/${genreMapping[id]}`);
  };

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
            name: genre.name,
          };
        })}
      styles={{
        imagesLayoutContainer: styles.verticalStack,
        imageContainer: styles.genreImage,
        imageText: styles.genreTitle,
      }}
      handleClick={handleGenreClick}
    />
  );
};

export default FeaturedGenresSectionContainer;
