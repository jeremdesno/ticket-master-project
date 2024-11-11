import React from 'react';

import defaultstyles from '../styles/components/ImageSection.module.css';

interface Image {
  imageUrl: string | null;
  id: string;
}
interface ImageSectionProps {
  images: Image[];
  styles: {
    imagesLayoutContainer: string;
    imageContainer: string;
  };
  handleClick: (id: string) => void;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  images,
  styles,
  handleClick,
}): JSX.Element => {
  return (
    <div className={styles.imagesLayoutContainer}>
      {images.map((image, idx) => (
        <div
          key={idx}
          className={styles.imageContainer}
          onClick={(): void => {
            handleClick(image.id);
          }}
        >
          {image.imageUrl ? (
            <img src={image.imageUrl} className={defaultstyles.image} />
          ) : (
            <p className={defaultstyles.p}>Image not available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageSection;
