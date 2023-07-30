import React from 'react';
import './DragAndDrop.css';
import { DragAndDropProps } from './DragAndDrop.types';

const DragAndDrop: React.FC<DragAndDropProps> = ({ isVisible }) => {
  return (
    <div
      className={`DragAndDrop ${
        isVisible ? 'DragAndDropVisible' : 'DragAndDropHidden'
      }`}
    >
      <div className={'DragAndDropContainer'}> Drag&Drop your file here</div>
    </div>
  );
};

export default DragAndDrop;
