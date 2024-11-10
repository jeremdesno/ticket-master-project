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
        layout: styles.squareGrid,
        image: styles.squareImage,
      }}
    />
  );
};

export default RecommendedSectionContainer;
