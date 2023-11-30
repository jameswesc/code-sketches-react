import React, { useMemo } from 'react';
import { useSeededColorPalette } from '@/features/colorPalette';
import { SketchSize } from '@/components/SketchSize';
import { IsometricRotation } from '@/components/IsometricRotation';
import { FrameExporter } from '@/features/frameExporter';
import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import { Smush32 } from '@thi.ng/random';
import { makeNoise2D } from 'open-simplex-noise';
import { range, group, groups } from 'd3-array';
import { useSeed } from '@/features/seed';
import { useControls } from 'leva';
import { XYZ, XY } from '@/types/xyz';
import { Noise2D } from 'open-simplex-noise/lib/2d';

function noiseSample(
    noise: Noise2D,
    x: number,
    z: number,
    octaves: number,
    frequency: number,
    amplitude: number,
    persistance: number
) {
    let y = 0;
    for (let i = 0; i < octaves; i++) {
        y += noise(x * frequency, z * frequency) * amplitude;
        amplitude *= persistance;
        frequency /= persistance;
    }
    return y;
}

interface IGrid {
    position?: XY;
    size?: XY;
    steps?: XY;
    stroke: string;
}

function Grid({
    position: [px, pz] = [0, 0],
    size: [sx, sz] = [10, 10],
    steps: [xSteps, zSteps] = [10, 10],
    stroke,
}: IGrid) {
    const seed = useSeed();
    const [xMin, zMin] = [px - 0.5 * sx, pz - 0.5 * sz];
    const [xMax, zMax] = [px + 0.5 * sx, pz + 0.5 * sz];

    const { octaves, amplitude, frequency, persistence } = useControls('Grid', {
        amplitude: 1.5,
        frequency: {
            value: 0.5,
            step: 0.01,
        },
        octaves: {
            value: 1,
            min: 0,
            max: 10,
            step: 1,
        },
        persistence: 0.5,
    });

    const lineData = useMemo(() => {
        const xs = range(xMin, xMax, sx / (xSteps - 1)).concat(xMax);
        const zs = range(zMin, zMax, sz / (zSteps - 1)).concat(zMax);
        const noise = makeNoise2D(seed);

        const gridPoints: XYZ[] = [];
        for (let x of xs) {
            for (let z of zs) {
                let y = noiseSample(
                    noise,
                    x,
                    z,
                    octaves,
                    frequency,
                    amplitude,
                    persistence
                );
                gridPoints.push([x, y > 0 ? y : -0.2, z]);
            }
        }

        const xLines = groups(gridPoints, (p) => p[0]).map((d) => d[1]);
        const zLines = groups(gridPoints, (p) => p[2]).map((d) => d[1]);

        return {
            xLines,
            zLines,
        };
    }, [
        seed,
        octaves,
        amplitude,
        frequency,
        persistence,
        xMax,
        zMax,
        xSteps,
        zSteps,
        xMin,
        zMin,
    ]);

    return (
        <group>
            {lineData.xLines.map((points, i) => (
                <Line
                    key={'x-' + i}
                    points={points}
                    color={stroke}
                    lineWidth={1}
                />
            ))}
            {lineData.zLines.map((points, i) => (
                <Line
                    key={'z-' + i}
                    points={points}
                    color={stroke}
                    lineWidth={1}
                />
            ))}
        </group>
    );
}

export function Sketch() {
    const seed = useSeed();
    const [stroke, , , bg] = useSeededColorPalette();

    const gridProps = useControls('Grid Props', {
        position: [0, 0],
        size: [20, 20],
        steps: [80, 80],
    });

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
                <FrameExporter prefix="cs-210919" />
                <IsometricRotation>
                    <Grid {...gridProps} stroke={stroke} />
                </IsometricRotation>
                <OrbitControls />
            </Canvas>
        </SketchSize>
    );
}
