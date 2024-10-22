import React from 'react';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';
import styles from '../styles/GenrePage.module.css';

interface EventCardProps {
  event: EventDataModel | EventSearchResult;
  earliestSession: EventSessionDataModel;
  onDetailsClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  earliestSession,
  onDetailsClick,
}) => {
  return (
    <div key={event.id} className={styles.eventCard}>
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
