import { MutableRefObject } from 'react';
export type cubeFace = 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM';
export interface ViewCubeProps {
    camera: MutableRefObject<THREE.PerspectiveCamera | null>;
    onClick: (face: cubeFace) => void;
    enableInteraction?: boolean;
}
