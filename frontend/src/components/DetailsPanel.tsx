import React from 'react';
import { AiOutlineRight } from 'react-icons/ai';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import SuggestedSectionContainer from '../containers/SuggestedSectionContainer';
import styles from '../styles/components/DetailsPanel.module.css';

interface DetailsPanelProps {
  event: EventDataModel;
  sessions: EventSessionDataModel[];
  isOpen: boolean;
  onClose: () => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  event,
  sessions,
  isOpen,
  onClose,
}) => {
  const sessionsByDate = sessions.reduce(
    (acc: { [date: string]: EventSessionDataModel[] }, session) => {
      const dateKey = session.startDate.toLocaleDateString('default', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(session);
      return acc;
    },
    {},
  );

  return (
    <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose}>
        <AiOutlineRight />
      </button>
      <h2 className={styles.header}>{event.name}</h2>
      <h3 className={styles.subHeader}>{event.venueName}</h3>
      <h3 className={styles.subHeader}>{event.venueAddress}</h3>
      <div className={styles.bodyContainer}>
        <div className={styles.panelContent}>
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.name}
              className={styles.eventImage}
            />
          ) : (
            <div className={styles.placeholder}>No Image Available</div>
          )}
          <p className={styles.eventDescription}>{event.description}</p>
        </div>
        <div className={styles.sessions}>
          <h4>Upcomming Sessions</h4>
          {Object.entries(sessionsByDate).map(([date, sessions]) => (
            <div key={date} className={styles.sessionDateGroup}>
              <h5 className={styles.dateHeader}>{date}</h5>
              <ul className={styles.sessionList}>
                {sessions.map((session) => (
                  <li key={session.id} className={styles.sessionItem}>
                    <a
                      href={session.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {session.startDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.suggestedEventsSection}>
        <h3>Similar events</h3>
        <SuggestedSectionContainer
          className={styles.suggestedEventsContainer}
          eventId={event.id}
        />
      </div>
    </div>
  );
};

export default DetailsPanel;
