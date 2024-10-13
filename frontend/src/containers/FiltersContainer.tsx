import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DateFilter from '../components/DateFilter';
import GenreFilter from '../components/GenreFilter';
import styles from '../styles/Filters.module.css';

interface FiltersContainerProps {
  genres: string[];
  currentGenre: string;
  currentStartDate: Date | null;
  currentEndDate: Date | null;
}

const FiltersContainer: React.FC<FiltersContainerProps> = ({
  genres,
  currentGenre,
  currentStartDate,
  currentEndDate,
}) => {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState<string>(currentGenre);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(currentStartDate);
  const [endDate, setEndDate] = useState<Date | null>(currentEndDate);

  useEffect((): void => {
    setSelectedGenre(currentGenre);
  }, [currentGenre]);

  useEffect((): void => {
    setStartDate(currentStartDate || null);
  }, [currentStartDate]);

  useEffect((): void => {
    setEndDate(currentEndDate || null);
  }, [currentEndDate]);

  const handleDropdowntoggle = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGenreSelect = (genre: string): void => {
    const formattedStartDate = startDate ? startDate.toISOString() : '';
    const formattedEndDate = endDate ? endDate.toISOString() : '';
    setSelectedGenre(genre);
    setIsDropdownOpen(false);
    navigate(`/events/${genre}/${formattedStartDate}/${formattedEndDate}`);
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
    navigate(`/events/${selectedGenre}`);
  };

  return (
    <div className={styles.filtersContainer}>
      <h3>Filters</h3>
      <GenreFilter
        handleDropdowntoggle={handleDropdowntoggle}
        isDropdownOpen={isDropdownOpen}
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
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
