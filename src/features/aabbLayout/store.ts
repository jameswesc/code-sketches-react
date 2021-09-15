import create from 'zustand';
import { IAABLayout } from './types';

export const useAABBControls = create<IAABLayout>((set) => ({
    layers: 3,
    trials: 20,
    trialsFactor: 2,
    scale: 10,
    scaleFactor: 1,
    minSize: 0.1,
    maxSize: 10,
    sizeFactor: 0.5,
}));
