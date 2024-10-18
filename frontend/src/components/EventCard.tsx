import React from 'react';

import { ExtractedEventDataModel } from '../../../backend/src/common/models';
import styles from '../styles/GenrePage.module.css';

interface EventCardProps {
  event: ExtractedEventDataModel;
  onDetailsClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onDetailsClick }) => {
  return (
    <div key={event.id} className={styles.eventCard}>
      <h2 className={styles.eventTitle}>{event.name}</h2>
      <p className={styles.eventDetails}>
        <strong>Date:</strong> {event.startDate.toDateString()}
      </p>
      <p className={styles.eventDetails}>
        <strong>Sales Start:</strong> {event.startDateSales.toDateString()}
      </p>
      <p className={styles.eventDetails}>
        <strong>Venue:</strong> {event.venueName}
      </p>
      <div className={styles.eventButtons}>
        <a
          href={event.url}
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
