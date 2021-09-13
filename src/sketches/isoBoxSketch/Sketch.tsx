import React from 'react';
import { IsometricCanvas } from './IsometricCanvas';
import { AABBLayout, IAABB } from '@/features/aabbLayout';
import { SketchedBox } from '@/features/sketchedBox/Box';
import { useSeededColorPalette } from '@/features/colorPalette';
import { OrbitControls } from '@react-three/drei';
import { ResolutionContainer } from '@/features/resolution';

function MyBox({ position: [px, py, pz], size: [sx, sy, sz] }: IAABB) {
    const [cx, cy, cz, stroke] = useSeededColorPalette();

    return (
        <SketchedBox
            position={[px, py, pz]}
            size={[sx, sy, sz]}
            xColor={cx}
            yColor={cy}
            zColor={cz}
            strokeColor={stroke}
            innerStrokeWidth={0.05}
            outerStrokeWidth={0.05}
            doubleSided
        />
    );
}

export function Sketch() {
    const [, , , , bg] = useSeededColorPalette();

    return (
        <ResolutionContainer>
            <IsometricCanvas background={bg}>
                <AABBLayout component={MyBox} />
                {/* <OrbitControls /> */}
            </IsometricCanvas>
        </ResolutionContainer>
    );
}
