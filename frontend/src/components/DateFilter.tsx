// DateFilter.tsx

import React from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import styles from '../styles/Filters.module.css';

interface DateFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onApplyDateFilter: () => void;
  onResetDates: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyDateFilter,
  onResetDates,
}) => {
  return (
    <div className={styles.dateFilter}>
      <div className={styles.datePickerRow}>
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy/MM/dd"
          placeholderText="Start Date"
        />
      </div>

      <div className={styles.datePickerRow}>
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy/MM/dd"
          placeholderText="End Date"
        />
      </div>
      <div className={styles.dateButtons}>
        <button className={styles.resetDatesButton} onClick={onResetDates}>
          Reset Dates
        </button>
        <button className={styles.applyDatesButton} onClick={onApplyDateFilter}>
          Apply Dates
        </button>
      </div>
    </div>
  );
};

export default DateFilter;
