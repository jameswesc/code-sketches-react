import create, { SetState } from 'zustand';

interface ICanvas {
    orthographic: boolean;
    zPos: number;
    fov: number;
    zoom: number;
    set: SetState<ICanvas>;
}

export const useCanvasControls = create<ICanvas>((set) => ({
    orthographic: false,
    zPos: 30,
    fov: 45,
    zoom: 50,
    set,
}));
