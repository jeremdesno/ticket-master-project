import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EventDataModel } from '../../../backend/src/common/models';
import { fetchEvents } from '../api/eventService';
import GenreSection from '../components/GenreSection';

interface GenreSectionProps {
  genre: string;
  index: number;
}

const GenreSectionContainer: React.FC<GenreSectionProps> = ({
  genre,
  index,
}): JSX.Element => {
  const [events, setEvents] = useState<EventDataModel[] | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const loadEvents = async (): Promise<void> => {
      try {
        const today = new Date();
        const startDate = today.toISOString();

        const fetchedGenreEvents = await fetchEvents(
          genre,
          undefined,
          startDate,
        );
        setEvents(fetchedGenreEvents);
      } catch (error) {
        console.error(`Failed to fetch ${genre} events:`, error);
      }
    };
    loadEvents();
  }, [genre]);

  const handleEventClick = (eventId: string): void => {
    navigate(`/event/${eventId}`);
  };
  if (!events || events.length < 10) {
    return <></>;
  }
  return (
    <GenreSection
      key={genre}
      genre={genre}
      events={events}
      autoplayDirection={index % 2 === 0 ? 'rtl' : 'ltr'}
      handleEventClick={handleEventClick}
    />
  );
};

export default GenreSectionContainer;
