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
          imagesLayoutContainer: styles.bigImageLayout,
          imageContainer: styles.bigImage,
        }}
      />
      <ImageSection
        images={images.slice(1)}
        styles={{
          imagesLayoutContainer: styles.smallImagesGrid,
          imageContainer: styles.smallImage,
        }}
      />
    </div>
  );
};

export default MostLikedSectionContainer;
