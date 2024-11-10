import React from 'react';

import defaultstyles from '../styles/components/ImageSection.module.css';

interface ImageSectionProps {
  images: (string | null)[];
  styles: {
    layout: string;
    image: string;
  };
}

const ImageSection: React.FC<ImageSectionProps> = ({
  images,
  styles,
}): JSX.Element => {
  return (
    <div className={styles.layout}>
      {images.map((imageUrl, idx) => (
        <div key={idx} className={styles.image}>
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
