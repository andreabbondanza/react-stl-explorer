import React from 'react';

interface StlExplorerProps {
    source?: string | File;
    showViewCube?: boolean;
    allowFullscreen?: boolean;
    enableInteraction?: boolean;
    enableDragAndDrop?: boolean;
    meshColor?: number;
}

declare const StlExplorer: React.FC<StlExplorerProps>;

export { StlExplorer as default };
