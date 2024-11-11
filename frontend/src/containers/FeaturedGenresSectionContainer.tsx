import React from 'react';

import ImageSection from '../components/ImageSection';
import styles from '../styles/components/FeaturedGenresSection.module.css';

const FeaturedGenresSectionContainer: React.FC = (): JSX.Element => {
  const images = [
    'https://via.placeholder.com',
    'https://via.placeholder.com',
    'https://via.placeholder.com',
    'https://via.placeholder.com',
  ];

  return (
    <ImageSection
      images={images}
      styles={{
        imagesLayoutContainer: styles.verticalStack,
        imageContainer: styles.genreImage,
      }}
    />
  );
};

export default FeaturedGenresSectionContainer;