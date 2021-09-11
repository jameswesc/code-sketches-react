import React, { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { FrameExporter } from '@/features/frameExporter';

export function SketchCanvas({
    background,
    children,
}: {
    background?: string;
    children: ReactNode;
}) {
    return (
        <Canvas
            dpr={[1, 2]}
            camera={{
                fov: 50,
                position: [0, 0, 30],
                near: 0.1,
                far: 1000,
            }}
        >
            {background && <color attach="background" args={[background]} />}

            <FrameExporter />

            {children}
        </Canvas>
    );
}
