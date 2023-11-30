import React, { useMemo } from 'react';
import { useSeededColorPalette } from '@/features/colorPalette';
import { SketchSize } from '@/components/SketchSize';
import { IsometricRotation } from '@/components/IsometricRotation';
import { FrameExporter } from '@/features/frameExporter';
import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import {} from '@thi.ng/random';
import { makeNoise2D, makeNoise3D } from 'open-simplex-noise';
import { makeRectangle } from 'fractal-noise';
import { range } from 'd3-array';
import { useSeed } from '@/features/seed';
import { useControls } from 'leva';
import { XYZ } from '@/types/xyz';

function Lines() {
    const seed = useSeed();
    const [stroke] = useSeededColorPalette();

    const { size, points, lines, octaves, amplitude, frequency, persistence } =
        useControls('Sketch', {
            size: 10,
            points: 100,
            lines: 50,
            amplitude: 1,
            frequency: {
                value: 0.01,
                step: 0.001,
            },
            octaves: {
                value: 2,
                min: 0,
                step: 1,
            },
            persistence: 0.5,
        });

    const lineData = useMemo(() => {
        const xs = range(-0.5 * size, 0.5 * size, size / points).concat(
            0.5 * size
        );
        const zs = range(-0.5 * size, 0.5 * size, size / lines);

        const noise2d = makeNoise2D(seed);
        // Should return number[][]
        const noiseMap = makeRectangle(points + 5, lines + 5, noise2d, {
            octaves,
            amplitude,
            frequency,
            persistence,
        });

        return zs.map((z, l) =>
            xs.map((x, p) => {
                let y = 0;
                try {
                    // @ts-ignore
                    y = noiseMap[p][l] * (1 - l / lines);
                } catch (e) {
                    console.warn(
                        `Failed to access noise map for p ${p} & l ${l}`
                    );
                }

                const point: XYZ = [x, y, z];
                return point;
            })
        );
    }, [seed, size, points, lines, octaves, amplitude, frequency, persistence]);

    return (
        <group>
            {lineData.map((points, i) => (
                <Line key={i} points={points} color={stroke} lineWidth={1} />
            ))}
        </group>
    );
}

export function Sketch() {
    const [, , , , bg] = useSeededColorPalette();

    return (
        <SketchSize>
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
                <color attach="background" args={[bg]} />
                <FrameExporter prefix="cs-210918" />
                <IsometricRotation>
                    <Lines />
                </IsometricRotation>
                <OrbitControls />
            </Canvas>
        </SketchSize>
    );
}
