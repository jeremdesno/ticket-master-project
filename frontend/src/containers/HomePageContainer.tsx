import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ExtractedEventDataModel,
  GenreDataModel,
} from '../../../backend/src/common/models';
import { fetchEvents } from '../api/eventService';
import { fetchGenres } from '../api/genreService';
import GenreSection from '../components/GenreSection';

const HomePageContainer: React.FC = (): JSX.Element => {
  const [genres, setGenres] = useState<GenreDataModel[]>([]);
  useEffect(() => {
    const loadGenres = async (): Promise<void> => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    loadGenres();
  }, []);

  const initialEvents: { [key: string]: ExtractedEventDataModel[] } = {};
  genres.forEach((genre) => {
    initialEvents[genre.name] = [];
  });
  const [events, setEvents] = useState<{
    [key: string]: ExtractedEventDataModel[] | [];
  }>(initialEvents);

  useEffect(() => {
    const loadEvents = async (): Promise<void> => {
      try {
        const updatedEvents: { [key: string]: ExtractedEventDataModel[] } = {
          ...events,
        };
        const today = new Date();
        const startDate = today.toISOString();
        for (const genre of genres) {
          try {
            const fetchedGenreEvents = await fetchEvents(genre.name, startDate);
            updatedEvents[genre.name] = fetchedGenreEvents;
          } catch (error) {
            console.error(
              `Failed to fetch events for genre ${genre.name}:`,
              error,
            );
          }
        }

        setEvents(updatedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    if (genres.length > 0) {
      loadEvents();
    }
  }, [genres]);
  const navigate = useNavigate();
  return (
    <div>
      {genres.length === 0 ? (
        <p>Loading genres...</p>
      ) : (
        genres
          .filter((genre) => events[genre.name]?.length > 10)
          .map((genre, index) => (
            <GenreSection
              key={genre.id}
              genre={genre.name}
              events={events[genre.name]}
              autoplayDirection={index % 2 === 0 ? 'rtl' : 'ltr'}
              handleEventClick={(eventId: string): void => {
                navigate(`/event/${eventId}`);
              }}
            />
          ))
      )}
    </div>
  );
};

export default HomePageContainer;
