import React from 'react';

import ImageSection from '../components/ImageSection';
import styles from '../styles/components/RecommendedSection.module.css';

const RecommendedSectionContainer: React.FC = (): JSX.Element => {
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
        imagesLayoutContainer: styles.squareGrid,
        imageContainer: styles.squareImage,
      }}
    />
  );
};

export default RecommendedSectionContainer;
