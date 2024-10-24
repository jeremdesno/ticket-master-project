import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DateFilter from '../components/DateFilter';
import GenreFilter from '../components/GenreFilter';
import styles from '../styles/Filters.module.css';

interface FiltersContainerProps {
  genres: string[];
  currentGenre: string;
  subGenres: string[];
  currentSubGenre: string | null;
  currentStartDate?: Date;
  currentEndDate?: Date;
}

const FiltersContainer: React.FC<FiltersContainerProps> = ({
  genres,
  currentGenre,
  subGenres,
  currentSubGenre,
  currentStartDate,
  currentEndDate,
}) => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState<string>(currentGenre);
  const [selectedSubGenre, setSelectedSubGenre] = useState<string>(
    currentSubGenre ? currentSubGenre : 'All',
  );
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isSubGenreDropdownOpen, setIsSubGenreDropdownOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(
    currentStartDate,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(currentEndDate);

  useEffect((): void => {
    setSelectedGenre(currentGenre);
  }, [currentGenre]);

  useEffect((): void => {
    setSelectedSubGenre(currentSubGenre ? currentSubGenre : 'All');
  }, [currentSubGenre]);

  useEffect((): void => {
    setStartDate(currentStartDate);
  }, [currentStartDate]);

  useEffect((): void => {
    setEndDate(currentEndDate);
  }, [currentEndDate]);

  const handleGenreDropdowntoggle = (): void => {
    setIsGenreDropdownOpen(!isGenreDropdownOpen);
  };

  const handleSubGenreDropdowntoggle = (): void => {
    setIsSubGenreDropdownOpen(!isSubGenreDropdownOpen);
  };

  const handleGenreSelect = (genre: string): void => {
    setSelectedGenre(genre);
    setIsGenreDropdownOpen(false);
    navigate(`/events/${genre}`, {
      state: {
        subGenre: 'All',
        startDate: startDate,
        endDate: endDate,
      },
    });
  };

  const handleSubGenreSelect = (subGenre: string): void => {
    setSelectedSubGenre(subGenre);
    setIsSubGenreDropdownOpen(false);
    navigate(`/events/${selectedGenre}`, {
      state: {
        subGenre: encodeURIComponent(subGenre),
        startDate: startDate,
        endDate: endDate,
      },
    });
  };

  const handleApplyDateFilter = (): void => {
    navigate(`/events/${selectedGenre}`, {
      state: {
        subGenre: encodeURIComponent(selectedSubGenre),
        startDate: startDate,
        endDate: endDate,
      },
    });
  };

  const handleResetDates = (): void => {
    setStartDate(undefined);
    setEndDate(undefined);

    navigate(`/events/${selectedGenre}`, {
      state: { subGenre: encodeURIComponent(selectedSubGenre) },
    });
  };

  return (
    <div className={styles.filtersContainer}>
      <h3>Filters</h3>
      <GenreFilter
        handleDropdowntoggle={handleGenreDropdowntoggle}
        isDropdownOpen={isGenreDropdownOpen}
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
      />
      <GenreFilter
        handleDropdowntoggle={handleSubGenreDropdowntoggle}
        isDropdownOpen={isSubGenreDropdownOpen}
        genres={['All', ...subGenres]}
        selectedGenre={selectedSubGenre ? selectedSubGenre : 'All'}
        onGenreSelect={handleSubGenreSelect}
      />
      <DateFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(date: Date | null): void =>
          setStartDate(date ? date : undefined)
        }
        onEndDateChange={(date: Date | null): void =>
          setEndDate(date ? date : undefined)
        }
        onApplyDateFilter={handleApplyDateFilter}
        onResetDates={handleResetDates}
      />
    </div>
  );
};

export default FiltersContainer;
