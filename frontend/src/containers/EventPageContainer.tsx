import React from 'react';
import { useNavigate } from 'react-router-dom';

import { EventDataModel } from '../../../backend/src/common/models';
import EventCard from '../components/EventCard';
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

const relatedEvents: EventDataModel[] = Array.from(
  { length: 4 },
  (_, index) => ({
    id: String(index + 1),
    name: `Event ${index + 1}`,
    startDate: new Date(`2024-07-${index + 10}`),
    endDate: new Date(`2024-07-${index + 12}`),
    url: `https://event${index + 1}.com`,
    description: `This is the description for Event ${index + 1}`,
    genre: index % 2 === 0 ? 'Jazz' : 'Hip Hop',
    startDateSales: new Date('2024-01-01'),
    endDateSales: new Date('2024-07-01'),
    venueAddress: `${index + 1} Venue St.`,
    venueName: `Venue ${index + 1}`,
  }),
);

const EventPage: React.FC = (): React.JSX.Element => {
  const imageUrl = ''; // Image URL is empty for the fake event

  const navigate = useNavigate();
  const handleDetailsClick = (eventId: string): void => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className={styles.eventPageContainer}>
      <div className={styles.eventDetailsSection}>
        <div className={styles.leftSection}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={event.name}
              className={styles.eventImage}
            />
          ) : (
            <div className={styles.imageUnavailable}>Image Unavailable</div>
          )}
          <div className={styles.eventDetails}>
            <p>
              <strong>Venue:</strong> {event.venueName}
            </p>
            <p>
              <strong>Address:</strong> {event.venueAddress}
            </p>
            <p>
              <strong>Start Date:</strong>{' '}
              {event.startDate.toLocaleDateString()}
            </p>
            <p>
                <strong>End Date:</strong> {event.endDate ? event.endDate.toLocaleDateString() : 'Not defined'}
            </p>
            <p>
              <strong>Sales Period:</strong>{' '}
              {event.startDateSales.toLocaleDateString()} -{' '}
              {event.endDateSales.toLocaleDateString()}
            </p>
          </div>
          <a
            className={styles.accessWebsiteButton}
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Event Website
          </a>
        </div>

        <div className={styles.rightSection}>
          <h1>{event.name}</h1>
          <p>{event.description}</p>
        </div>
      </div>
      <div className={styles.suggestedEventsSection}>
        <h3>You Might Like</h3>
        <div className={styles.suggestedEventsContainer}>
          {relatedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDetailsClick={(): void => {
                handleDetailsClick(event.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
