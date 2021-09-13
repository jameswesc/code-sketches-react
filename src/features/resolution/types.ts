export type Mode = 'screen' | 'aspect-ratio' | 'set';

export interface IResolution {
    mode: Mode;
    ratio: number;
    width: number;
    height: number;
}
