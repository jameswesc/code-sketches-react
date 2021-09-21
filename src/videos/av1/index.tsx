import React, { useEffect, useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig, useCurrentFrame, Audio } from 'remotion';
import { useSeed, useSeedStore } from '@/features/seed';
import { useSeededColorPalette } from '@/features/colorPalette';
import { Box, Line, Plane } from '@react-three/drei';
import music from './gamblers-and-gallantry by walz Artlist.mp3';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { IsometricRotation } from '@/components/IsometricRotation';
import { ScaleToFit } from '@/components/ScaleToFit';
import { XY, XYZ } from '@/types/xyz';
import { range, groups } from 'd3-array';
import { Leva, useControls } from 'leva';
import { makeNoise2D } from 'open-simplex-noise';

interface IRoof {
    size: XY;
    offset: XY;
    index: number;
}

function Roof({ size: [sx, sz], offset: [ox, oz], index }: IRoof) {
    const {
        steps: [xstep, zstep],
        frequency,
        amplitude,
    } = useControls('Roof', {
        steps: [10, 10],
        frequency: 0.4,
        amplitude: 1,
    });

    const seed = useSeed();
    const [, s1, , , , s2] = useSeededColorPalette();

    const frame = useCurrentFrame();

    // console.log(visualization[12]);

    const noise = makeNoise2D(seed);

    const xs = range(-0.5 * sx, 0.5 * sx, sx / (xstep - 1)).concat(0.5 * sx);
    const zs = range(-0.5 * sz, 0.5 * sz, sz / (zstep - 1)).concat(0.5 * sz);

    const f = frequency;
    const a = amplitude;

    const positions: XYZ[] = [];

    for (let xi = 0; xi < xs.length; xi++) {
        for (let zi = 0; zi < zs.length; zi++) {
            let x = xs[xi];
            let z = zs[zi];
            let y =
                (noise((x + ox) * f, (z + oz + frame * 0.1) * f) * 0.5 + 0.5) *
                a;
            // y = y > 0 ? y : 0;
            // y = xi === 0 || xi === xs.length - 1 ? 0 : y;
            // y = zi === 0 || zi === zs.length - 1 ? 0 : y;

            positions.push([x, y, z]);
        }
    }

    const xLines = groups(positions, (p) => p[0]).map((d) => d[1]);
    const zLines = groups(positions, (p) => p[2]).map((d) => d[1]);

    return (
        <group position-y={0.01}>
            {xLines.map((points, i) => (
                <Line key={'x' + i} points={points} color={s2} />
            ))}
            {zLines.map((points, i) => (
                <Line key={'z' + i} points={points} color={s2} />
            ))}
        </group>
    );
}

interface ICube {
    size: XY;
    height?: number;
    // will use this for noise, dont need to position
    offset: XY;
    index: number;
}

function Cube({ size: [sx, sz], offset: [ox, oz], height = 1, index }: ICube) {
    const [, xcolor, zcolor, ycolor] = useSeededColorPalette();

    return (
        <group>
            <group>
                <Plane
                    rotation-y={0.5 * Math.PI}
                    position-x={0.5 * sx}
                    args={[sz, height]}
                >
                    <meshBasicMaterial color={zcolor} />
                </Plane>
                <Plane position-z={0.5 * sz} args={[sx, height]}>
                    <meshBasicMaterial color={xcolor} />
                </Plane>
                <group position-y={0.5 * height}>
                    <Plane args={[sx, sz]} rotation-x={-0.5 * Math.PI}>
                        <meshBasicMaterial color={ycolor} />
                    </Plane>
                </group>
            </group>

            {/* This one will be replaced */}
            <group position-y={0.5 * height}>
                <Roof size={[sx, sz]} offset={[ox, oz]} index={index} />
            </group>
        </group>
    );
}

interface ICell {
    size: XY;
    position: XY;
}

export function Grid() {
    const {
        gridSize: [rows, cols],
        cellSize: [cx, cy],
        padding,
        height,
    } = useControls('Grid', {
        gridSize: [4, 4],
        cellSize: [4, 4],
        padding: {
            value: 0.2,
            min: 0,
            max: 1,
            step: 0.01,
        },
        height: 2,
    });

    const cells = useMemo(() => {
        const cells: ICell[] = [];

        for (let xi = 0; xi < cols; xi++) {
            for (let yi = 0; yi < rows; yi++) {
                const position: XY = [(xi + 0.5) * cx, (yi + 0.5) * cy];
                cells.push({
                    position,
                    size: [cx, cy],
                });
            }
        }

        return cells;
    }, [rows, cols, cx, cy]);

    return (
        <>
            {/* <axesHelper args={[10]} /> */}
            <group position-x={-0.5 * cols * cx} position-z={-0.5 * rows * cy}>
                {cells.map((d, i) => (
                    <group
                        key={i}
                        position-x={d.position[0]}
                        position-z={d.position[1]}
                        scale-x={1 - padding}
                        scale-z={1 - padding}
                    >
                        <Cube
                            offset={d.position}
                            size={d.size}
                            height={height}
                            index={i}
                        />
                    </group>
                ))}
            </group>
        </>
    );
}

export interface IAV1 {
    videoSeed?: number;
}

export function AV1({ videoSeed = 1 }: IAV1) {
    useEffect(() => {
        useSeedStore.setState({ seed: videoSeed });
    }, [videoSeed]);

    const { width, height } = useVideoConfig();
    const seed = useSeed();
    const [bg] = useSeededColorPalette();

    return (
        <>
            <Leva hidden />
            <Audio src={music} />
            <ThreeCanvas
                dpr={[1, 2]}
                orthographic
                camera={{
                    position: [0, 0, 100],
                    near: 0.1,
                    far: 1000,
                    zoom: 50,
                }}
                width={width}
                height={height}
            >
                <color attach="background" args={[bg]} />
                <IsometricRotation>
                    <ScaleToFit size={20}>
                        <Grid />
                    </ScaleToFit>
                </IsometricRotation>
            </ThreeCanvas>
        </>
    );
}
