export type Mode = 'screen' | 'aspect-ratio' | 'set';

type ObjectFit = 'cover' | 'contain';

export interface IResolution {
    mode: Mode;
    ratio: number;
    width: number;
    height: number;
    objectFit: ObjectFit;
}
