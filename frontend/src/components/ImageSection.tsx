import React from 'react';

import defaultstyles from '../styles/components/ImageSection.module.css';

interface ImageSectionProps {
  images: (string | null)[];
  styles: {
    imagesLayoutContainer: string;
    imageContainer: string;
  };
}

const ImageSection: React.FC<ImageSectionProps> = ({
  images,
  styles,
}): JSX.Element => {
  return (
    <div className={styles.imagesLayoutContainer}>
      {images.map((imageUrl, idx) => (
        <div key={idx} className={styles.imageContainer}>
          {imageUrl ? (
            <img src={imageUrl} className={defaultstyles.image} />
          ) : (
            <p className={defaultstyles.p}>Image not available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageSection;
