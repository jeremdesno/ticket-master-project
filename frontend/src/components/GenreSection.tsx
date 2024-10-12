import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

import styles from '../styles/GenreSection.module.css';

interface Event {
  id: number;
  name: string;
  imageUrl?: string;
}

interface GenreSectionProps {
  genre: string;
  events: Event[];
  autoplayDirection: 'rtl' | 'ltr';
}

const GenreSection: React.FC<GenreSectionProps> = ({
  genre,
  events,
  autoplayDirection,
}): JSX.Element => {
  const renderCarouselItems = (): JSX.Element[] => {
    return events.map((event) => (
      <div key={event.id} className={styles.eventPlaceholder}>
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className={styles.eventImage}
          />
        ) : (
          <span className={styles.eventImage}>Image not available</span>
        )}
      </div>
    ));
  };

  const carouselSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 2000,
    slidesToShow: 7,
    slidesToScroll: 1,
    arrows: false,
    rtl: autoplayDirection === 'rtl' ? true : false,
  };

  return (
    <section className={styles.genreSection}>
      <h2 className={styles.genreTitle}>{genre}</h2>
      <div className={styles.eventsContainer}>
        <Slider {...carouselSettings}>{renderCarouselItems()}</Slider>
      </div>
    </section>
  );
};

export default GenreSection;
