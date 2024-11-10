import React from 'react';

interface ImageSectionProps {
  images: string[];
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
          <img src={imageUrl} />
        </div>
      ))}
    </div>
  );
};

export default ImageSection;
