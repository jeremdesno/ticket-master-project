import React from 'react';
import { EventDataModel } from '../../../backend/src/common/models';
import styles from '../styles/EventPage.module.css';

/* To be fetched from the API using the id */
const event: EventDataModel = {
    id: '1',
    name: 'Jazz Night Concert',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-21'),
    url: 'https://example.com/jazz-night',
    description:
      'Join us for an unforgettable Jazz Night Concert featuring world-class musicians. Enjoy a night of smooth melodies and vibrant performances.',
    genre: 'Jazz',
    startDateSales: new Date('2024-11-01'),
    endDateSales: new Date('2024-12-19'),
    venueAddress: '123 Music Avenue, New York, NY',
    venueName: 'Jazz Hall',
  };

const EventPage: React.FC = (): React.JSX.Element => {
    const imageUrl = ''; // Image URL is empty for the fake event

    return (
      <div className={styles.eventPageContainer}>
        <div className={styles.leftSection}>
          {imageUrl ? (
            <img src={imageUrl} alt={event.name} className={styles.eventImage} />
          ) : (
            <div className={styles.imageUnavailable}>Image Unavailable</div>
          )}
          <div className={styles.eventDetails}>
            <p><strong>Venue:</strong> {event.venueName}</p>
            <p><strong>Address:</strong> {event.venueAddress}</p>
            <p><strong>Start Date:</strong> {event.startDate.toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {event.endDate.toLocaleDateString()}</p>
            <p><strong>Sales Period:</strong> {event.startDateSales.toLocaleDateString()} - {event.endDateSales.toLocaleDateString()}</p>
          </div>
          <a className={styles.accessWebsiteButton} href={event.url} target="_blank" rel="noopener noreferrer">Event Website</a>
        </div>
  
        <div className={styles.rightSection}>
          <h1>{event.name}</h1>
          <p>{event.description}</p>
        </div>
      </div>
    );
  };

export default EventPage;
