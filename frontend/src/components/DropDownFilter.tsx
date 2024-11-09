import React from 'react';

import styles from '../styles/components/DropDownFilter.module.css';

interface DropDownFilterProps {
  handleDropdowntoggle: () => void;
  isDropdownOpen: boolean;
  items: string[];
  selectedItem: string;
  onItemSelect: (item: string) => void;
}

const DropDownFilter: React.FC<DropDownFilterProps> = ({
  handleDropdowntoggle,
  isDropdownOpen,
  items,
  selectedItem,
  onItemSelect,
}) => {
  return (
    <div className={styles.dropDownFilter}>
      <button onClick={handleDropdowntoggle} className={styles.dropdownButton}>
        {selectedItem}
        <span className={styles.dropdownArrow}>
          {isDropdownOpen ? '▲' : '▼'}
        </span>
      </button>
      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          {items.map((item) => (
            <button
              key={item}
              onClick={(): void => onItemSelect(item)}
              className={`${styles.item} ${
                selectedItem === item ? styles.itemSelected : ''
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDownFilter;
