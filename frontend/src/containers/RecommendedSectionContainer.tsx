import React from 'react';

import ImageSection from '../components/ImageSection';
import styles from '../styles/components/RecommendedSection.module.css';

const RecommendedSectionContainer: React.FC = (): JSX.Element => {
  const images = [
    { imageUrl: 'https://via.placeholder.com', id: '1' },
    { imageUrl: 'https://via.placeholder.com', id: '2' },
    { imageUrl: 'https://via.placeholder.com', id: '3' },
    { imageUrl: 'https://via.placeholder.com', id: '4' },
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
