import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ReactNode } from 'react';
import { useCanvasControls } from './store';

export function R3fCanvas({ children }: { children: ReactNode }) {
    const { orthographic, zPos, fov, zoom } = useCanvasControls();

    return (
        <Canvas
            dpr={[1, 2]}
            camera={{
                position: [0, 0, zPos],
                fov,
                zoom,
            }}
            orthographic={orthographic}
        >
            {children}
        </Canvas>
    );
}
