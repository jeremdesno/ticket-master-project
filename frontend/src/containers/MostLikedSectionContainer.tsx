import React from 'react';

import ImageSection from '../components/ImageSection';
import styles from '../styles/components/MostLikedSection.module.css';

const MostLikedSectionContainer: React.FC = (): JSX.Element => {
  const images = [
    'https://via.placeholder.com',
    'https://via.placeholder.com',
    'https://via.placeholder.com',
    'https://via.placeholder.com',
    'https://via.placeholder.com',
  ];
  return (
    <div className={styles.mostLikedLayout}>
      <ImageSection
        images={[images[0]]}
        styles={{
          layout: styles.bigImageLayout,
          image: styles.bigImage,
        }}
      />
      <ImageSection
        images={images.slice(1)}
        styles={{
          layout: styles.smallImagesGrid,
          image: styles.smallImage,
        }}
      />
    </div>
  );
};

export default MostLikedSectionContainer;
