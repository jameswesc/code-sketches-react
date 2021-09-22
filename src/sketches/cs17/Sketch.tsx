import React, {
    useCallback,
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

const useMouseIndex = create<{
    x: number;
    y: number;
    setXY(xy: number[]): void;
}>((set) => ({
    x: 0,
    y: 0,
    setXY(xy: number[]) {
        set({ x: xy[0], y: xy[1] });
    },
}));

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

function MyPoint({
    xy: [x, y],
    color,
    xIndex,
    yIndex,
}: {
    xy: XY;
    color: string;
    xIndex: number;
    yIndex: number;
}) {
    const ref = useRef();
    useEffect(
        () =>
            useMouseIndex.subscribe(({ x, y }) => {
                if (ref.current) {
                    if (x === xIndex && y === yIndex) {
                        // @ts-ignore
                        ref.current.color.setStyle('#ffff00');
                    } else {
                        // @ts-ignore
                        ref.current.color.setStyle(color);
                    }
                }
            }),
        [ref]
    );

    // @ts-ignore
    return <Point ref={ref} position={[x, y, 0]} color={color} />;
}

interface ICell {
    index: XY;
    center: XY;
    radius: number;
    size: XY;
    angle: number;
}

const { cos, sin, PI } = Math;

function MyLine({ cell: { center, size, angle } }: { cell: ICell }) {
    const [, stroke] = useSeededColorPalette();
    const radius = 0.4 * Math.min(...size);

    return (
        <group position-x={center[0]} position-y={center[1]}>
            <Line
                points={[
                    [radius * cos(angle), radius * sin(angle), 0],
                    [-radius * cos(angle), -radius * sin(angle), 0],
                ]}
                color={stroke}
            />
        </group>
    );
}

function FullScreenGrid() {
    const { width, height } = useThree((s) => s.viewport);

    const { rowsAndColumns, frequency } = useControls('Grid', {
        rowsAndColumns: {
            value: 40,
            step: 1,
        },
        frequency: {
            value: 0.5,
            min: 0,
            max: 1,
            step: 0.01,
        },
    });

    const [, color] = useSeededColorPalette();
    const xStep = width / (rowsAndColumns - 1);
    const yStep = height / (rowsAndColumns - 1);
    const size: XY = useMemo(() => [xStep, yStep], [xStep, yStep]);
    const radius = Math.min(...size) * 0.5;

    const xs = useMemo(
        () => range(-0.5 * width, 0.5 * width, xStep).concat(0.5 * width),
        [xStep, width]
    );
    const ys = useMemo(
        () => range(-0.5 * height, 0.5 * height, yStep).concat(0.5 * height),
        [height, yStep]
    );

    const seed = useSeed();

    const grid = useMemo(() => {
        const noise = makeNoise2D(seed);

        const grid = xs.map((x, xi) =>
            ys.map((y, yi) => {
                const cell: ICell = {
                    index: [xi, yi],
                    size,
                    radius,
                    center: [x, y],
                    angle: Math.PI * noise(x * frequency, y * frequency),
                };
                return cell;
            })
        );

        return grid;
    }, [xs, ys, seed, frequency]);

    const flatGrid = useMemo(() => grid.flatMap((x) => x), [grid]);

    return (
        <group>
            {flatGrid.map((cell, i) => (
                <MyLine key={i} cell={cell} />
            ))}
        </group>
    );
}

export function Sketch() {
    const seed = useSeed();
    const [bg] = useSeededColorPalette();

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
                <FrameExporter prefix="CS.16" />
                {/* <NoAutoClear /> */}

                <FullScreenGrid />
                <OrbitControls />
            </Canvas>
        </SketchSize>
    );
}
