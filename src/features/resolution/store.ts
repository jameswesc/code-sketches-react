import create from 'zustand';
import { IResolution } from './types';

export const useResolutionStore = create<IResolution>(() => ({
    mode: 'screen',
    ratio: 1,
    width: 400,
    height: 400,
    objectFit: 'cover',
}));
