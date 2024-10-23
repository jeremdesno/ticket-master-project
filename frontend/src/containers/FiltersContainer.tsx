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
  currentStartDate: Date | null;
  currentEndDate: Date | null;
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
  const [selectedSubGenre, setSelectedSubGenre] = useState<string | null>(
    currentSubGenre,
  );
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isSubGenreDropdownOpen, setIsSubGenreDropdownOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(currentStartDate);
  const [endDate, setEndDate] = useState<Date | null>(currentEndDate);

  useEffect((): void => {
    setSelectedGenre(currentGenre);
  }, [currentGenre]);

  useEffect((): void => {
    setSelectedSubGenre(currentSubGenre);
  }, [currentSubGenre]);

  useEffect((): void => {
    setStartDate(currentStartDate || null);
  }, [currentStartDate]);

  useEffect((): void => {
    setEndDate(currentEndDate || null);
  }, [currentEndDate]);

  const handleGenreDropdowntoggle = (): void => {
    setIsGenreDropdownOpen(!isGenreDropdownOpen);
  };

  const handleSubGenreDropdowntoggle = (): void => {
    setIsSubGenreDropdownOpen(!isSubGenreDropdownOpen);
  };

  const handleGenreSelect = (genre: string): void => {
    const formattedStartDate = startDate ? startDate.toISOString() : '';
    const formattedEndDate = endDate ? endDate.toISOString() : '';
    setSelectedGenre(genre);
    setIsGenreDropdownOpen(false);
    navigate(
      `/events/${genre}/${selectedSubGenre}/${formattedStartDate}/${formattedEndDate}`,
    );
  };

  const handleSubGenreSelect = (subGenre: string): void => {
    const formattedStartDate = startDate ? startDate.toISOString() : '';
    const formattedEndDate = endDate ? endDate.toISOString() : '';
    setSelectedSubGenre(subGenre);
    setIsSubGenreDropdownOpen(false);
    navigate(
      `/events/${selectedGenre}/${subGenre}/${formattedStartDate}/${formattedEndDate}`,
    );
  };

  const handleApplyDateFilter = (): void => {
    const formattedStartDate = startDate ? startDate.toISOString() : '';
    const formattedEndDate = endDate ? endDate.toISOString() : '';
    navigate(
      `/events/${selectedGenre}/${formattedStartDate}/${formattedEndDate}`,
    );
  };

  const handleResetDates = (): void => {
    setStartDate(null);
    setEndDate(null);
    navigate(`/events/${selectedGenre}/${selectedSubGenre}`);
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
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApplyDateFilter={handleApplyDateFilter}
        onResetDates={handleResetDates}
      />
    </div>
  );
};

export default FiltersContainer;
