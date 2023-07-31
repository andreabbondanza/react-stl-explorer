import React from 'react';
import './DragAndDrop.css';
import { DragAndDropProps } from './DragAndDrop.types';

const DragAndDrop: React.FC<DragAndDropProps> = ({
  isVisible,
  onFileSelect,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    onFileSelect(file);
  };
  return (
    <div
      className={`DragAndDrop ${
        isVisible ? 'DragAndDropVisible' : 'DragAndDropHidden'
      }`}
    >
      <div className={'DragAndDropContainer'}>
        <div>
          Drag&Drop your file here <div>or</div>
          <input id="file" type="file" onChange={handleFileChange} />
          <label htmlFor="file">Choose a file</label>
        </div>
      </div>
    </div>
  );
};

export default DragAndDrop;
