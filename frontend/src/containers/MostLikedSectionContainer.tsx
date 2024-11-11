import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EventDataModel } from '../../../backend/src/common/models';
import { fetchTrendingEvents } from '../api/eventService';
import ImageSection from '../components/ImageSection';
import styles from '../styles/components/MostLikedSection.module.css';

const MostLikedSectionContainer: React.FC = (): JSX.Element => {
  const [events, setEvents] = useState<EventDataModel[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrendingEvents = async (): Promise<void> => {
      try {
        const fetchedTrendingEvents = await fetchTrendingEvents();
        setEvents(fetchedTrendingEvents);
      } catch (error) {
        console.log('Failed to fetch trending events:', error);
      }
    };
    loadTrendingEvents();
  }, []);
  const handleEventClick = (id: string): void => {
    navigate(`/event/${id}`);
  };
  if (!events) {
    return <div>Loading trending events...</div>;
  }
  return (
    <div className={styles.mostLikedLayout}>
      <ImageSection
        images={[events[0]]}
        styles={{
          imagesLayoutContainer: styles.bigImageLayout,
          imageContainer: styles.bigImage,
        }}
        handleClick={handleEventClick}
      />
      <ImageSection
        images={events.slice(1)}
        styles={{
          imagesLayoutContainer: styles.smallImagesGrid,
          imageContainer: styles.smallImage,
        }}
        handleClick={handleEventClick}
      />
    </div>
  );
};

export default MostLikedSectionContainer;
