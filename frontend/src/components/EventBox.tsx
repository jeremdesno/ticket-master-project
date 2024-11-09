import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import Button from './Button';
import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import styles from '../styles/components/EventBox.module.css';

interface EventRectangleProps {
  event: EventDataModel;
  earliestSession: EventSessionDataModel;
  onDetailsClick: () => void;
  onFavoriteClick: () => void;
}

const EventRectangle: React.FC<EventRectangleProps> = ({
  event,
  earliestSession,
  onDetailsClick,
  onFavoriteClick,
}) => {
  return (
    <div className={styles.eventContainer} key={event.id}>
      <div className={styles.dateContainer}>
        <div className={styles.month}>
          {earliestSession.startDate.toLocaleString('default', {
            month: 'short',
          })}
        </div>
        <div className={styles.day}>{earliestSession.startDate.getDate()}</div>
      </div>

      <div className={styles.imageContainer}>
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className={styles.eventImage}
          />
        ) : (
          <span className={styles.imagePlaceholder}>Image not available</span>
        )}
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.titleRow}>
          <h3 className={styles.eventTitle}>{event.name}</h3>
          <button
            className={styles.infoButton}
            onClick={onDetailsClick}
            aria-label="More information"
          >
            <AiOutlineInfoCircle />
          </button>
        </div>
        <p className={styles.eventDate}>
          {earliestSession.startDate.toLocaleString('default', {
            weekday: 'short',
          })}{' '}
          {earliestSession.startDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p className={styles.eventVenue}>
          {event.venueName}, {event.venueAddress}
        </p>
      </div>

      <div className={styles.actionContainer}>
        <Button
          className={styles.favoritesButton}
          label="Remove Favorite"
          onClick={onFavoriteClick}
        />
        <a
          href={earliestSession.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ticketLink}
        >
          Get Tickets
        </a>
      </div>
    </div>
  );
};

export default EventRectangle;
