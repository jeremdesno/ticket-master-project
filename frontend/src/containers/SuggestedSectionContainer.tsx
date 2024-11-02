import React, { useEffect } from 'react';
import { useState } from 'react';

import {
  EventDataModel,
  EventSessionDataModel,
} from '../../../backend/src/common/models';
import { SemanticSearchResult } from '../../../backend/src/recommendation/types';
import {
  fetchEvent,
  fetchEventSessions,
  fetchSimilarEvents,
} from '../api/eventService';
import SuggestedSection from '../components/SuggestedSection';

interface EventCardProps {
  eventId: string;
}

const SuggestedSectionContainer: React.FC<EventCardProps> = ({
  eventId,
}): JSX.Element => {
  const [similarEvents, setSimilarEvents] = useState<EventDataModel[] | null>(
    null,
  );
  const [similarEventsEarliestSession, SetSimilarEventsEarliestSession] =
    useState<EventSessionDataModel[] | null>(null);

  useEffect(() => {
    const loadSimilarEventsData = async (eventId: string): Promise<void> => {
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

        const fetchedSimilarEventsEarliestSession = await Promise.all(
          similarEventsSearchResults.map(
            async (searchResult: SemanticSearchResult) => {
              const session = await fetchEventSessions(searchResult.eventId, 1);
              if (session) {
                return session[0];
              } else {
                throw new Error(
                  `Failed to fetch event ${searchResult.eventId} earliest session.`,
                );
              }
            },
          ),
        );

        setSimilarEvents(fetchedSimilarEvents);
        SetSimilarEventsEarliestSession(fetchedSimilarEventsEarliestSession);
      } catch (error) {
        console.log('Failed to fetch similar events: ', error);
      }
    };
    loadSimilarEventsData(eventId);
  }, [eventId]);

  if (!similarEvents || !similarEventsEarliestSession) {
    return <div>Loading...</div>;
  }
  return (
    <SuggestedSection
      suggestedEvents={similarEvents}
      suggestedEventsEarliestSession={similarEventsEarliestSession}
    />
  );
};

export default SuggestedSectionContainer;
