import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { EventSearchResult } from '../../../backend/src/search/types';
import { SearchEvents } from '../api/eventService';
import EventsGridContainer from '../containers/EventsGridContainer';
import styles from '../styles/pages/SearchResultsPage.module.css';

const NumberSearchResults = 15;

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') as string;

  const [events, setEvents] = useState<EventSearchResult[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [lastDocSortScore, setLastDocSortScore] = useState<number | null>(null);
  const [lastDocSortId, setLastDocSortId] = useState<string | null>(null);
  const [nextEvents, setNextEvents] = useState<EventSearchResult[]>([]);
  const [noMoreMatches, setNoMoreMatches] = useState<boolean>(false);

  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFirstSearchResults = async (): Promise<void> => {
      setEvents([]);
      setNoMoreMatches(false);
      setLoading(true);
      try {
        const searchedEvents = await SearchEvents(
          query,
          null,
          null,
          NumberSearchResults,
        );

        if (searchedEvents.length > 0) {
          setLastDocSortId(searchedEvents[searchedEvents.length - 1].id);
          setLastDocSortScore(searchedEvents[searchedEvents.length - 1].score);
        }
        if (
          searchedEvents.length < NumberSearchResults ||
          searchedEvents.length === 0
        ) {
          setNoMoreMatches(true);
        }
        setEvents(searchedEvents);
      } catch (error) {
        console.error('Failed to fetch events or sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFirstSearchResults();
  }, [query]);

  useEffect(() => {
    if (nextEvents.length > 0) {
      setEvents((prevEvents) => [...prevEvents, ...nextEvents]);
    }
  }, [nextEvents]);

  const handleLoadMore = async (): Promise<void> => {
    const scrollPosition = gridContainerRef.current?.scrollTop || 0;

    const searchedEvents = await SearchEvents(
      query,
      lastDocSortScore,
      lastDocSortId,
      NumberSearchResults,
    );

    if (searchedEvents.length > 0) {
      setLastDocSortId(searchedEvents[searchedEvents.length - 1].id);
      setLastDocSortScore(searchedEvents[searchedEvents.length - 1].score);
    }
    if (
      searchedEvents.length < NumberSearchResults ||
      searchedEvents.length === 0
    ) {
      setNoMoreMatches(true);
    }
    setNextEvents(searchedEvents);
    setTimeout(() => {
      if (gridContainerRef.current) {
        gridContainerRef.current.scrollTop = scrollPosition;
      }
    }, 0);
  };

  if (loading) {
    return <div></div>;
  }

  if (!events.length) {
    return <div>No results for query: {query}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Search Results for: {query}</h1>
      <div
        className={styles.gridContainer}
        ref={gridContainerRef}
        style={{ maxHeight: '90%', overflowY: 'scroll' }}
      >
        <EventsGridContainer events={events} />
        {!noMoreMatches ? (
          <button className={styles.loadMoreButton} onClick={handleLoadMore}>
            Load More
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SearchResultsPage;
