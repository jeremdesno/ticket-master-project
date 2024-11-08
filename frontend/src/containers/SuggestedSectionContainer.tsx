import React, { useEffect } from 'react';
import { useState } from 'react';

import EventsGridContainer from './EventsGridContainer';
import { EventDataModel } from '../../../backend/src/common/models';
import { SemanticSearchResult } from '../../../backend/src/recommendation/types';
import { fetchEvent, fetchSimilarEvents } from '../api/eventService';

interface SuggestedSectionContainerProps {
  eventId: string;
  className?: string;
}

const SuggestedSectionContainer: React.FC<SuggestedSectionContainerProps> = ({
  eventId,
  className,
}): JSX.Element => {
  const [similarEvents, setSimilarEvents] = useState<EventDataModel[] | null>(
    null,
  );

  useEffect(() => {
    const loadSimilarEvents = async (eventId: string): Promise<void> => {
      try {
        const similarEventsSearchResults = await fetchSimilarEvents(eventId);
        const fetchedSimilarEvents = await Promise.all(
          similarEventsSearchResults.map(
            async (searchResult: SemanticSearchResult) => {
              const event = await fetchEvent(searchResult.eventId);
              if (event) {
                return event;
              } else {
                throw new Error(
                  `Failed to fetch event ${searchResult.eventId}.`,
                );
              }
            },
          ),
        );
        setSimilarEvents(fetchedSimilarEvents);
      } catch (error) {
        console.log('Failed to fetch similar events: ', error);
      }
    };
    loadSimilarEvents(eventId);
  }, [eventId]);

  if (!similarEvents) {
    return <div>Loading...</div>;
  }
  if (similarEvents.length === 0) {
    return <div></div>;
  }
  return <EventsGridContainer className={className} events={similarEvents} />;
};

export default SuggestedSectionContainer;
