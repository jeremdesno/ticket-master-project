import React from 'react';

import { EventDataModel } from '../../../backend/src/common/models';
import EventCardContainer from '../containers/EventCardContainer';
import styles from '../styles/SuggestedEventsSection.module.css';

interface SuggestedSectionProps {
  suggestedEvents: EventDataModel[];
  className?: string;
}
const SuggestedSection: React.FC<SuggestedSectionProps> = ({
  suggestedEvents,
  className,
}) => {
  return (
    <div className={className ?? styles.suggestedEventsContainer}>
      {suggestedEvents.map((event) => (
        <EventCardContainer key={event.id} event={event} />
      ))}
    </div>
  );
};

export default SuggestedSection;
