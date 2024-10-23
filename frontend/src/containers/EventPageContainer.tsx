import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { fetchEvent, fetchEventSessions } from '../api/eventService';
import EventCard from '../components/EventCard';
import styles from '../styles/EventPage.module.css';

// Mock events
const relatedEvents: EventDataModel[] = Array.from(
  { length: 4 },
  (_, index) => ({
    id: String(index + 1),
    name: `Event ${index + 1}`,
    description: `This is the description for Event ${index + 1}`,
    genre: index % 2 === 0 ? 'Jazz' : 'Hip Hop',
    subGenre: 'Rock',
    venueAddress: `${index + 1} Venue St.`,
    venueName: `Venue ${index + 1}`,
    imageUrl: null,
  }),
);

// Mock sessions for each event
const relatedSessions: { [key: string]: EventSessionDataModel } = Array.from(
  { length: 4 },
  (_, index) => ({
    id: String(index + 1),
    eventId: String(index + 1),
    startDate: new Date(`2024-07-${index + 10}`),
    endDate: new Date(`2024-07-${index + 12}`),
    url: `https://event${index + 1}.com`,
    startDateSales: new Date('2024-01-01'),
    endDateSales: new Date('2024-07-01'),
  }),
).reduce<{ [key: string]: EventSessionDataModel }>((acc, session) => {
  acc[session.eventId] = session;
  return acc;
}, {});

const EventPage: React.FC = (): React.JSX.Element => {
  const { eventId } = useParams<{
    eventId: string;
  }>() as { eventId: string };

  const [event, setEvent] = useState<EventDataModel | null>(null);
  const [sessions, setSessions] = useState<EventSessionDataModel[] | null>(
    null,
  );

  // Fetch event and sessions
  useEffect(() => {
    const loadEventData = async (): Promise<void> => {
      try {
        const fetchedEvent = await fetchEvent(eventId);
        const fetchedSessions = await fetchEventSessions(eventId);
        setEvent(fetchedEvent);
        setSessions(fetchedSessions);
      } catch (error) {
        console.error('Failed to fetch event or sessions:', error);
      }
    };
    loadEventData();
  }, [eventId]);
  const navigate = useNavigate();
  const handleDetailsClick = (eventId: string): void => {
    navigate(`/event/${eventId}`);
  };
  if (!event || !sessions) {
    return (
      <div>An error happened while fetching the event's information...</div>
    );
  }
  // Find the first session (main session) and set it as default
  const mainSession = sessions[0];
  const otherSessions = sessions.slice(1);

  return (
    <div className={styles.eventPageContainer}>
      <div className={styles.eventDetailsSection}>
        {/* Left Section (Main Session Details) */}
        <div className={styles.leftSection}>
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
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
            {mainSession && (
              <>
                <p>
                  {mainSession.startDate.toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  <br />
                  {mainSession.startDate.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                  {mainSession.endDate
                    ? ` - ${mainSession.endDate.toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}`
                    : ''}
                </p>
                <p>
                  <strong>Sales Period:</strong>{' '}
                  {mainSession.startDateSales.toLocaleDateString()} -{' '}
                  {mainSession.endDateSales.toLocaleDateString()}
                </p>
              </>
            )}
          </div>
          <a
            className={styles.accessWebsiteButton}
            href={mainSession.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Event Website
          </a>
        </div>

        {/* Right Section (Event Description + Additional Sessions) */}
        <div className={styles.centerSection}>
          <h1>{event.name}</h1>
          <p>{event.description}</p>
        </div>
        {/* Section to show other available sessions */}
        {otherSessions.length > 0 && (
          <div className={styles.otherSessions}>
            <h3>Other Sessions</h3>
            <ul className={styles.sessionList}>
              {otherSessions.map((session) => (
                <li key={session.id}>
                  <p>
                    <strong>Start Date:</strong>{' '}
                    {session.startDate.toLocaleDateString()}
                  </p>
                  <a
                    href={session.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy Tickets
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Suggested Events Section */}
      <div className={styles.suggestedEventsSection}>
        <h3>You Might Like</h3>
        <div className={styles.suggestedEventsContainer}>
          {relatedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              earliestSession={relatedSessions[event.id]}
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
