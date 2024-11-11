import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { EventDataModel } from '../../../backend/src/common/models';
import { fetchEvents, fetchNumberEvents } from '../api/eventService';
import { fetchGenres, fetchSubGenres } from '../api/genreService';
import Pagination from '../components/Pagination';
import { genreImagesPaths } from '../constants/genres';
import EventsGridContainer from '../containers/EventsGridContainer';
import FiltersContainer from '../containers/FiltersContainer';
import styles from '../styles/pages/GenrePage.module.css';

const eventsPerPage = 15;
interface LocationState {
  subGenre?: string;
  startDate?: Date;
  endDate?: Date;
}

const EventsPageContainer: React.FC = (): React.JSX.Element => {
  const { genre } = useParams<{ genre: string }>() as { genre: string };
  const location = useLocation();
  const { subGenre, startDate, endDate } = (location.state ||
    {}) as LocationState;

  const [genres, setGenres] = useState<string[]>([]);
  const [genreMap, setGenreMap] = useState<{ [key: string]: string }>({});
  const [subGenres, setSubGenres] = useState<string[]>([]);
  const [events, setEvents] = useState<EventDataModel[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const decodedSubGenre = subGenre ? decodeURIComponent(subGenre) : undefined;
  const currentSubGenre =
    decodedSubGenre === 'All' ? undefined : decodedSubGenre;

  useEffect(() => {
    const loadGenres = async (): Promise<void> => {
      try {
        const fetchedGenres = await fetchGenres();
        const genreNames = fetchedGenres.map((genre) => genre.name);
        const mapGenreToId = fetchedGenres.reduce((dict, genre) => {
          dict[genre.name] = genre.id;
          return dict;
        }, {} as { [key: string]: string });
        setGenreMap(mapGenreToId);

        setGenres(genreNames);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const loadGenreSubgenres = async (): Promise<void> => {
      try {
        const fetchedSubGenres = await fetchSubGenres(genreMap[genre]);
        const subGenreNames = fetchedSubGenres.map((subGenre) => subGenre.name);
        setSubGenres(subGenreNames);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    if (Object.keys(genreMap).length > 0 && genre) {
      loadGenreSubgenres();
    }
  }, [genre, genreMap]);

  useEffect(() => {
    const getNumberTotalPages = async (): Promise<void> => {
      try {
        const totalEvents = await fetchNumberEvents(
          genre,
          currentSubGenre,
          startDate ? startDate.toISOString() : undefined,
          endDate ? endDate.toISOString() : undefined,
        );
        if (totalEvents) {
          setTotalPages(Math.ceil(totalEvents / eventsPerPage));
        }
      } catch (error) {
        console.error('Failed to get total number of pages:', error);
      }
    };
    getNumberTotalPages();
  }, [genre, decodedSubGenre, startDate, endDate]);

  useEffect(() => {
    const loadEvents = async (): Promise<void> => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * eventsPerPage;
        const fetchedEvents = await fetchEvents(
          genre,
          currentSubGenre,
          startDate ? startDate.toISOString() : undefined,
          endDate ? endDate.toISOString() : undefined,
          eventsPerPage,
          offset,
        );
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Failed to fetch events or sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [genre, decodedSubGenre, startDate, endDate, currentPage]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div>
      <div className={styles.header}>
        {genreMap[genre] in genreImagesPaths && (
          <img
            src={genreImagesPaths[genreMap[genre]]}
            className={styles.headerBackgroundImage}
          />
        )}
        <h1 className={styles.headerGenreTitle}>{genre} Events</h1>
      </div>
      <div className={styles.eventsPageLayout}>
        <div className={styles.bodyLayout}>
          {!events.length ? (
            <div>No available events for these filters...</div>
          ) : (
            <>
              <EventsGridContainer
                events={events}
                startDate={startDate}
                endDate={endDate}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
        <FiltersContainer
          genres={genres}
          subGenres={subGenres}
          currentGenre={genre}
          currentSubGenre={currentSubGenre ? currentSubGenre : null}
          currentStartDate={startDate}
          currentEndDate={endDate}
        />
      </div>
    </div>
  );
};

export default EventsPageContainer;
