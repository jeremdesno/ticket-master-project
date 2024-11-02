import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { fetchEvent, fetchEventSessions } from '../api/eventService';
import {
  addFavorite,
  fetchFavoriteStatus,
  removeFavorite,
} from '../api/favoritesService';
import Button from '../components/Button';
import SuggestedSectionContainer from '../containers/SuggestedSectionContainer';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/EventPage.module.css';

const EventPage: React.FC = (): React.JSX.Element => {
  const { eventId } = useParams<{
    eventId: string;
  }>() as { eventId: string };

  const [event, setEvent] = useState<EventDataModel | null>(null);
  const [sessions, setSessions] = useState<EventSessionDataModel[] | null>(
    null,
  );
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { userId } = useAuth() as { userId: number };

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

  useEffect(() => {
    const setFavoriteState = async (
      userId: number,
      eventId: string,
    ): Promise<void> => {
      try {
        const status = await fetchFavoriteStatus(userId, eventId);
        setIsFavorite(status);
      } catch (error) {
        console.error('Failed to fetch event favorite status:', error);
      }
    };
    setFavoriteState(userId, eventId);
  }, []);

  const handleFavoriteClick = async (): Promise<void> => {
    if (!isFavorite) {
      await addFavorite(userId, eventId);
    } else {
      await removeFavorite(userId, eventId);
    }
    setIsFavorite(!isFavorite);
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
          <div className={styles.buttonContainer}>
            <a
              className={styles.accessWebsiteButton}
              href={mainSession.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Event Website
            </a>
            <Button
              className={styles.favoritesButton}
              label={isFavorite ? 'Remove Favorite' : 'Add Favorite'}
              onClick={handleFavoriteClick}
            />
          </div>
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
      <SuggestedSectionContainer eventId={eventId} />
    </div>
  );
};

export default EventPage;
