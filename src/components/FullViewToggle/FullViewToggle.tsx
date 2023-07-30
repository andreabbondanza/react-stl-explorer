import './FullViewToggle.css';
import React from 'react';
import { faExpand, faMinimize } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FullViewToggleProps } from './FullViewToggle.types';

const FullViewToggle: React.FC<FullViewToggleProps> = ({
  onClick,
  isFullScreen,
}) => {
  return (
    <div className={'FullViewToggle'}>
      <FontAwesomeIcon
        icon={isFullScreen ? faMinimize : faExpand}
        onClick={() => onClick()}
      />
    </div>
  );
};

export default FullViewToggle;
