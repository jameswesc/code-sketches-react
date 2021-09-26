import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useSeededColorPalette } from '@/features/colorPalette';
import { SketchSize } from '@/components/SketchSize';
import { FrameExporter } from '@/features/frameExporter';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSeed, useSeedStore } from '@/features/seed';
import {
    OrbitControls,
    Plane,
    Points,
    Point,
    PointMaterial,
    Instance,
    Instances,
    Line,
} from '@react-three/drei';
import { range } from 'd3-array';
import { useControls } from 'leva';
import { XY } from '@/types/xyz';
import create from 'zustand';
import { makeNoise2D } from 'open-simplex-noise';
import { Smush32, uniform } from '@thi.ng/random';
import { clamp } from 'three/src/math/MathUtils';
import { NoAutoClear } from '@/components/NoAutoClear';

const { cos, sin, PI } = Math;

const INITIAL_SEED = 10335972;

interface ICell {
    center: XY;
    angle: number;
}

interface IGrid {
    grid: ICell[][];
    radius: number;
    size: XY;
}

interface IPoint {
    index: number;
    step: number;
    pause: boolean;
}

function DrawNoiseLines({ color = '#ffffff' }: { color?: string }) {
    const { show } = useControls('Noise Lines', {
        show: true,
    });

    const { grid, radius } = useGrid();

    const cells = useMemo(() => {
        return grid.flatMap((d) => d);
    }, [grid]);

    return (
        <group>
            {show &&
                cells.map(({ center: [cx, cy], angle }, i) => (
                    <group key={i} position-x={cx} position-y={cy}>
                        <Line
                            points={[
                                [radius * cos(angle), radius * sin(angle), 0],
                                [-radius * cos(angle), -radius * sin(angle), 0],
                            ]}
                            color={color}
                            lineWidth={0.2}
                        />
                    </group>
                ))}
        </group>
    );
}

function MyPoint({ index, step, pause }: IPoint) {
    const seed = useSeed();
    const [, , color] = useSeededColorPalette();

    const { width, height } = useThree((s) => s.viewport);

    const {
        grid,
        radius,
        size: [xStep, yStep],
    } = useGrid();

    const xLimit = grid.length - 1;
    const yLimit = grid[0].length - 1;

    const rndPos = useMemo(() => {
        const rnd = new Smush32(seed + index);
        const rx = uniform(rnd, -0.5 * width, 0.5 * width);
        const ry = uniform(rnd, -0.5 * height, 0.5 * height);
        return () => [rx(), ry()];
    }, [seed, index, width, height]);

    // Either get the index from the xy position, or return null
    const getIndex = useCallback<(x: number, y: number) => XY | null>(
        (x, y) => {
            const xIndex = Math.round((x + 0.5 * width) / xStep);
            const yIndex = Math.round((y + 0.5 * height) / yStep);

            if (
                xIndex < 0 ||
                xIndex > xLimit ||
                yIndex < 0 ||
                yIndex > yLimit
            ) {
                return null;
            }

            return [xIndex, yIndex];
        },
        [width, height, xStep, yStep, xLimit, yLimit]
    );

    const initialPosition = rndPos();

    const ref = useRef<any>();

    useFrame(() => {
        if (ref.current && !pause) {
            const ixy = getIndex(
                ref.current.position.x,
                ref.current.position.y
            );
            if (ixy) {
                const angle = grid[ixy[0]][ixy[1]].angle;
                ref.current.position.x += step * cos(angle);
                ref.current.position.y += step * sin(angle);
            } else {
                const [x, y] = rndPos();
                ref.current.position.set(x, y, 0);
            }
        }
    });

    return (
        // @ts-ignore
        <Point
            ref={ref}
            // @ts-ignore
            position={[initialPosition[0], initialPosition[1], 0]}
            color={color}
        />
    );
}

function MyPoints() {
    const { numPoints, scale, step, pause } = useControls('Points', {
        numPoints: {
            value: 100,
            step: 1,
        },
        scale: 2,
        step: 0.01,
        pause: false,
    });

    const points = range(0, numPoints + 1);

    return (
        <Points>
            {/* @ts-ignore */}
            <PointMaterial scale={scale} depthWrite={false} />
            {points.map((i) => (
                <MyPoint key={i} index={i} step={step} pause={pause} />
            ))}
        </Points>
    );
}

// ----------- GRID --------------

const GridContext = createContext<IGrid>(undefined as any);

function useGrid() {
    return useContext(GridContext);
}

function FullScreenGrid({ children }: { children?: ReactNode }) {
    const { width, height } = useThree((s) => s.viewport);

    const { rowsAndColumns, frequency } = useControls('Grid', {
        rowsAndColumns: {
            value: 50,
            step: 1,
        },
        frequency: {
            value: 0.1,
            min: 0,
            max: 1,
            step: 0.01,
        },
    });

    const seed = useSeed();

    const grid: IGrid = useMemo(() => {
        const noise = makeNoise2D(seed);

        const xStep = width / (rowsAndColumns - 1);
        const yStep = height / (rowsAndColumns - 1);
        const radius = Math.min(xStep, yStep) * 0.5;

        const xs = range(-0.5 * width, 0.5 * width, xStep).concat(0.5 * width);

        const ys = range(-0.5 * height, 0.5 * height, yStep).concat(
            0.5 * height
        );

        const grid = xs.map((x) =>
            ys.map((y) => {
                const cell: ICell = {
                    center: [x, y],
                    angle: PI * noise(x * frequency, y * frequency),
                };
                return cell;
            })
        );

        return {
            grid,
            size: [xStep, yStep],
            radius,
        };
    }, [seed, frequency, width, height, rowsAndColumns]);

    return <GridContext.Provider value={grid}>{children}</GridContext.Provider>;
}

// ----------------- Sketch -------------------

useSeedStore.setState({ seed: INITIAL_SEED });

export function Sketch() {
    const [bg, stroke] = useSeededColorPalette();

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
                gl={{
                    preserveDrawingBuffer: true,
                }}
            >
                <color attach="background" args={[bg]} />
                <FrameExporter prefix="CS.18" />
                <NoAutoClear />
                <group scale-x={1.2} scale-y={1.2}>
                    <FullScreenGrid>
                        {/* <DrawNoiseLines color={stroke} /> */}
                        <MyPoints />
                    </FullScreenGrid>
                </group>
            </Canvas>
        </SketchSize>
    );
}
