import React, { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { IsometricRotation } from '@/components/IsometricRotation';

import { FrameExporter } from '@/features/frameExporter';
import { ScaleToFit } from '@/components/ScaleToFit';

export function IsometricCanvas({
    background,
    children,
}: {
    background?: string;
    children: ReactNode;
}) {
    return (
        <Canvas
            dpr={[1, 2]}
            orthographic
            camera={{
                position: [0, 0, 100],
                near: 0.1,
                far: 1000,
                zoom: 50,
            }}
        >
            {background && <color attach="background" args={[background]} />}
            <FrameExporter />
            <IsometricRotation>
                <ScaleToFit size={40}>{children}</ScaleToFit>
            </IsometricRotation>
        </Canvas>
    );
}
