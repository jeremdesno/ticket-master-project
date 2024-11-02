import React from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';
import styles from '../styles/pages/GenrePage.module.css';

interface EventCardProps {
  event: EventDataModel | EventSearchResult;
  earliestSession: EventSessionDataModel;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  onDetailsClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  earliestSession,
  isFavorite,
  onFavoriteClick,
  onDetailsClick,
}) => {
  return (
    <div key={event.id} className={styles.eventCard}>
      <div
        className={`${styles.favoriteIcon} ${isFavorite ? styles.filled : ''}`}
        onClick={onFavoriteClick}
      >
        {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
      </div>
      <h2 className={styles.eventTitle}>{event.name}</h2>
      <p className={styles.eventDetails}>
        <strong>Date:</strong> {earliestSession.startDate.toDateString()}
      </p>
      <p className={styles.eventDetails}>
        <strong>Sales Start:</strong>{' '}
        {earliestSession.startDateSales.toDateString()}
      </p>
      <p className={styles.eventDetails}>
        <strong>Venue:</strong> {event.venueName}
      </p>
      <div className={styles.eventButtons}>
        <a
          href={earliestSession.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.accessWebsiteButton}
        >
          Access Website
        </a>
        <button className={styles.detailsButton} onClick={onDetailsClick}>
          Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;
