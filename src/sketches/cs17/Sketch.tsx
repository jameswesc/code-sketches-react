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
import { useSeed } from '@/features/seed';
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

function NoAutoClear() {
    const seed = useSeed();
    const [cleared, setCleared] = useState(false);

    useEffect(() => {
        setCleared(false);
    }, [seed, setCleared]);

    useFrame(({ gl, scene, camera }) => {
        if (!cleared) {
            gl.autoClear = true;
            gl.autoClearColor = true;
            setCleared(true);
        } else {
            gl.autoClear = false;
            gl.autoClearColor = false;
        }
    }, -1);

    return null;
}

interface ICell {
    center: XY;
    angle: number;
}

interface IGrid {
    grid: ICell[][];
    radius: number;
    size: XY;
}

const { cos, sin, PI } = Math;

const GridContext = createContext<IGrid>(undefined as any);

function useGrid() {
    return useContext(GridContext);
}

function DrawNoiseLines({ color = '#ffffff' }: { color?: string }) {
    const { show } = useControls('Noise Lines', {
        show: true,
    });

    const { grid, radius } = useGrid();

    const cells = useMemo(() => {
        console.log('TRIGGER');
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

const MAX_STEPS = 100_000_000;

function MyPoint({ start: [x1, y1], color }: { start: XY; color: string }) {
    const {
        grid,
        radius,
        size: [xStep, yStep],
    } = useGrid();

    const xLimit = grid.length - 1;
    const yLimit = grid[0].length - 1;

    const ref = useRef<any>();
    const stepsRef = useRef(0);
    const seed = useSeed();

    const { width, height } = useThree((s) => s.viewport);

    useEffect(() => {
        stepsRef.current = 0;
    }, [seed, x1, y1]);

    let xIndex: number, yIndex: number, angle: number;

    const step = radius * 0.4;

    useFrame(() => {
        if (ref.current) {
            xIndex = Math.round((ref.current.position.x + 0.5 * width) / xStep);
            yIndex = Math.round(
                (ref.current.position.y + 0.5 * height) / yStep
            );

            xIndex = clamp(xIndex, 0, xLimit);
            yIndex = clamp(yIndex, 0, yLimit);

            angle = grid[xIndex][yIndex].angle;
            console.log(xIndex, yIndex, angle);

            ref.current.position.x += step * cos(angle);
            ref.current.position.y += step * sin(angle);

            stepsRef.current += 1;
        }
    });

    return (
        // @ts-ignore
        <Point ref={ref} position={[x1, y1, 0]} color={color} />
    );
}

function MyPoints() {
    const seed = useSeed();
    const [, , color] = useSeededColorPalette();

    const { width, height } = useThree((s) => s.viewport);

    const { numPoints, scale } = useControls('Points', {
        numPoints: {
            value: 1,
            step: 1,
        },
        scale: 4,
    });

    const points = useMemo(() => {
        const rnd = new Smush32(seed);
        const rx = uniform(rnd, -0.5 * width, 0.5 * width);
        const ry = uniform(rnd, -0.5 * height, 0.5 * height);

        return new Array(numPoints).fill('x').map(() => [rx(), ry()] as XY);
    }, [seed, width, height, numPoints]);

    return (
        <Points>
            {/* @ts-ignore */}
            <PointMaterial scale={scale} />
            {points.map((p, i) => (
                <MyPoint key={`${seed}-${i}`} start={p} color={color} />
            ))}
        </Points>
    );
}

function FullScreenGrid({ children }: { children?: ReactNode }) {
    const { width, height } = useThree((s) => s.viewport);

    const { rowsAndColumns, frequency } = useControls('Grid', {
        rowsAndColumns: {
            value: 40,
            step: 1,
        },
        frequency: {
            value: 0.1,
            min: 0,
            max: 1,
            step: 0.01,
        },
    });

    const [, color] = useSeededColorPalette();

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

        const grid = xs.map((x, xi) =>
            ys.map((y, yi) => {
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

    console.log(grid.grid[0][0].angle);

    return <GridContext.Provider value={grid}>{children}</GridContext.Provider>;
}

export function Sketch() {
    const seed = useSeed();
    const [bg, stroke] = useSeededColorPalette();

    return (
        <SketchSize>
            <Canvas
                dpr={1}
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
                <FrameExporter prefix="CS.16" />
                <NoAutoClear />

                <FullScreenGrid>
                    {/* <DrawNoiseLines color={stroke} /> */}
                    <MyPoints />
                </FullScreenGrid>
                <OrbitControls />
            </Canvas>
        </SketchSize>
    );
}
