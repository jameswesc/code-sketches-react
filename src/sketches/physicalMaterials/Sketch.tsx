import React, { Suspense } from 'react';
import { AABBLayout, IAABB } from '@/features/aabbLayout';
import { useSeededColorPalette } from '@/features/colorPalette';
import { SketchCanvas } from './SketchCanvas';
import { Box, Environment, OrbitControls } from '@react-three/drei';
import { IsometricRotation } from '@/components/IsometricRotation';
import { ScaleToFit } from '@/components/ScaleToFit';
import { AABBComponentProps } from '@/features/aabbLayout/AABBLayout';

export function MyBox({
    position: [px, py, pz],
    size: [sx, sy, sz],
    index,
}: AABBComponentProps) {
    const theme = useSeededColorPalette();
    const color = theme[index % 5];
    return (
        <Box position={[px, py, pz]} args={[sx, sy, sz]}>
            <meshPhysicalMaterial
                color={color}
                roughness={1}
                clearcoat={1}
                clearcoatRoughness={1}
            />
        </Box>
    );
}

export function Sketch() {
    const [, , , , , bg] = useSeededColorPalette();

    return (
        <SketchCanvas background={bg}>
            <IsometricRotation>
                <ScaleToFit size={30}>
                    <AABBLayout component={MyBox} />
                </ScaleToFit>
            </IsometricRotation>
            <Suspense fallback={null}>
                <Environment preset="city" />
            </Suspense>
            <OrbitControls />
        </SketchCanvas>
    );
}
