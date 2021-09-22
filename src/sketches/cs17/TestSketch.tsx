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
} from '@react-three/drei';
import { range } from 'd3-array';
import { useControls } from 'leva';
import { XY } from '@/types/xyz';
import create from 'zustand';

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
                        console.log(ref.current);
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

function FullScreenGrid() {
    const { width, height } = useThree((s) => s.viewport);

    const { rowsAndColumns } = useControls('Grid', {
        rowsAndColumns: {
            value: 40,
            step: 1,
        },
    });

    const [, color] = useSeededColorPalette();
    const xStep = width / (rowsAndColumns - 1);
    const yStep = height / (rowsAndColumns - 1);

    const grid = useMemo(() => {
        const xs = range(0, width, xStep).concat(width);
        const ys = range(0, height, yStep).concat(height);

        const grid = xs.map((x) => ys.map((y) => [x, y] as XY));

        return grid;
    }, [width, height, rowsAndColumns, xStep, yStep]);

    const points = useMemo(() => grid.flatMap((x) => x), [grid]);

    const ref = useRef();

    // This is for mouse so x and y are normalized between -1 to 1
    const getIndex = useCallback(
        (x, y) => {
            const xIndex = Math.round(((x * 0.5 + 0.5) * width) / xStep);
            const yIndex = Math.round(((y * 0.5 + 0.5) * height) / yStep);
            return [xIndex, yIndex] as XY;
        },
        [width, xStep, height, yStep, grid]
    );

    const setXY = useMouseIndex((s) => s.setXY);

    useFrame(({ mouse: { x, y } }) => {
        setXY(getIndex(x, y));
    });

    return (
        <group position-x={-0.5 * width} position-y={-0.5 * height}>
            <Points limit={grid.length * grid[0].length}>
                {/* @ts-ignore */}
                <PointMaterial scale={20} depthWrite={false} />

                {grid.map((xs, xIndex) => (
                    <group key={xIndex}>
                        {xs.map((xy, yIndex) => (
                            <MyPoint
                                key={yIndex}
                                xIndex={xIndex}
                                yIndex={yIndex}
                                xy={xy}
                                color={color}
                            />
                        ))}
                    </group>
                ))}
            </Points>
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
