import React from 'react';

import { EventDataModel } from '../../../backend/src/common/models';
import styles from '../styles/DetailsPanel.module.css';

interface DetailsPanelProps {
  event: EventDataModel;
  isOpen: boolean;
  onClose: () => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  return (
    <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose}>
        Close
      </button>
      <div className={styles.panelContent}>
        <h2>Event Details</h2>
        <p>Details about the event go here...</p>
        <div>{event.name}</div>
      </div>
    </div>
  );
};

export default DetailsPanel;
