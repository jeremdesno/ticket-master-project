import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import EventsGridContainer from './EventsGridContainer';
import { EventSessionDataModel } from '../../../backend/src/common/models';
import { EventSearchResult } from '../../../backend/src/search/types';
import { fetchEventSessions, SearchEvents } from '../api/eventService';
import styles from '../styles/SearchResultsPage.module.css';

const NumberSearchResults = 15;

const SearchPageResultContainer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') as string;

  const [events, setEvents] = useState<EventSearchResult[]>([]);
  const [sessions, setSessions] = useState<{
    [key: string]: EventSessionDataModel;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [lastDocSortScore, setLastDocSortScore] = useState<number | null>(null);
  const [lastDocSortId, setLastDocSortId] = useState<string | null>(null);
  const [nextEvents, setNextEvents] = useState<EventSearchResult[]>([]);
  const [nextSessions, setNextSessions] = useState<{
    [key: string]: EventSessionDataModel;
  }>({});
  const [noMoreMatches, setNoMoreMatches] = useState<boolean>(false);

  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFirstSearchResults = async (): Promise<void> => {
      // Reset state when a new query is entered
      setEvents([]);
      setSessions({});
      setLastDocSortScore(null);
      setLastDocSortId(null);
      setNoMoreMatches(false);
      setLoading(true);
      try {
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
        setEvents(searchedEvents);

        const sessionsMap: { [key: string]: EventSessionDataModel } = {};
        await Promise.all(
          searchedEvents.map(async (event) => {
            try {
              const fetchedSessions = await fetchEventSessions(event.id, 1);
              sessionsMap[event.id] = fetchedSessions[0];
            } catch (error) {
              console.error(
                `Failed to fetch sessions for event ${event.id}:`,
                error,
              );
            }
          }),
        );

        setSessions(sessionsMap);
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

  useEffect(() => {
    if (Object.keys(nextSessions).length > 0) {
      setSessions((prevSessions) => ({ ...prevSessions, ...nextSessions }));
    }
  }, [nextSessions]);

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

    const sessionsMap: { [key: string]: EventSessionDataModel } = {};
    await Promise.all(
      searchedEvents.map(async (event) => {
        try {
          const fetchedSessions = await fetchEventSessions(event.id, 1);
          sessionsMap[event.id] = fetchedSessions[0];
        } catch (error) {
          console.error(
            `Failed to fetch sessions for event ${event.id}:`,
            error,
          );
        }
      }),
    );
    setNextSessions(sessionsMap);
    setTimeout(() => {
      if (gridContainerRef.current) {
        gridContainerRef.current.scrollTop = scrollPosition;
      }
    }, 0);
  };

  if (loading) {
    return <div></div>;
  }

  if (!events.length || Object.keys(sessions).length !== events.length) {
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
        <EventsGridContainer events={events} sessions={sessions} />
        {!noMoreMatches ? (
          <button className={styles.loadMoreButton} onClick={handleLoadMore}>
            Load More
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPageResultContainer;
