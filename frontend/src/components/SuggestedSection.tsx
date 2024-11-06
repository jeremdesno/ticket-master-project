import React from 'react';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import EventCardContainer from '../containers/EventCardContainer';
import styles from '../styles/SuggestedEventsSection.module.css';

interface SuggestedSectionProps {
  suggestedEvents: EventDataModel[];
  suggestedEventsEarliestSession: EventSessionDataModel[];
}
const SuggestedSection: React.FC<SuggestedSectionProps> = ({
  suggestedEvents,
  suggestedEventsEarliestSession,
}) => {
  return (
    <div className={styles.suggestedEventsContainer}>
      {suggestedEvents.map((event, index) => (
        <EventCardContainer
          key={event.id}
          event={event}
          session={suggestedEventsEarliestSession[index]}
        />
      ))}
    </div>
  );
};

export default SuggestedSection;
