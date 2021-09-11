import { Vec } from '@thi.ng/vectors';

export interface IAABB {
    position: Vec;
    size: Vec;
    min: Vec;
    max: Vec;
}

export interface IAABLayout {
    layers: number;

    trials: number;
    trialsFactor: number;

    minSize: number;
    maxSize: number;
    sizeFactor: number;

    scale: number;
    scaleFactor: number;
}
