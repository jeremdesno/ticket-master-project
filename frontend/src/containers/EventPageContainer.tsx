import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { EventDataModel } from '../../../backend/src/common/models';
import { fetchEvent } from '../api/eventService';
import EventCard from '../components/EventCard';
import styles from '../styles/EventPage.module.css';

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
    imageUrl: null,
  }),
);

const EventPage: React.FC = (): React.JSX.Element => {
  const { eventId } = useParams<{
    eventId: string;
  }>() as { eventId: string };
  const imageUrl = ''; // Image URL is empty for the fake event
  const [event, setEvent] = useState<EventDataModel | null>(null);
  useEffect(() => {
    const loadEvent = async (): Promise<void> => {
      try {
        const fetchedEvent = await fetchEvent(eventId);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      }
    };
    loadEvent();
  }, [event]);
  console.log(event);
  const navigate = useNavigate();
  const handleDetailsClick = (eventId: string): void => {
    navigate(`/event/${eventId}`);
  };
  if (event == null) {
    return <div>An error happened while fetching the event...</div>;
  } else {
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
                <strong>End Date:</strong>{' '}
                {event.endDate
                  ? event.endDate.toLocaleDateString()
                  : 'Not defined'}
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
  }
};

export default EventPage;
