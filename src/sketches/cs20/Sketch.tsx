import React, { useCallback, useMemo, useRef } from 'react';
import { useSeededColorPalette } from '@/features/colorPalette';
import { SketchSize } from '@/components/SketchSize';
import { FrameExporter } from '@/features/frameExporter';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSeed, useSeedStore } from '@/features/seed';
import { Points, Point, PointMaterial, Line } from '@react-three/drei';
import { range } from 'd3-array';
import { useControls } from 'leva';
import { XY } from '@/types/xyz';
import { Smush32, uniform } from '@thi.ng/random';
import { lerp } from 'three/src/math/MathUtils';
import { NoAutoClear } from '@/components/NoAutoClear';
import { NoiseGrid, useGrid } from '@/components/NoiseGrid';

const { cos, sin } = Math;

const INITIAL_SEED = 10335972;

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
    const theme = useSeededColorPalette();

    const color = theme[index % 6];
    // const color = theme[1];

    const { width, height } = useThree((s) => s.viewport);

    const {
        grid,
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
    const ixy = getIndex(initialPosition[0], initialPosition[1]);
    const initFlowAngle = ixy ? grid[ixy[0]][ixy[1]].angle : 0;

    const initAngle = useCallback(() => {
        const rnd = new Smush32(seed);
        // return rnd.float(0 * Math.PI);
        return rnd.minmax(initFlowAngle - 0.05, initFlowAngle + 0.05);
    }, [seed, index, initFlowAngle]);

    const ref = useRef<any>();
    // Give it an initial angle
    const angle = useRef(initAngle());

    useFrame(() => {
        if (ref.current && !pause) {
            const ixy = getIndex(
                ref.current.position.x,
                ref.current.position.y
            );
            if (ixy) {
                const flowAngle = grid[ixy[0]][ixy[1]].angle;
                angle.current = lerp(angle.current, flowAngle, 0.01);
                ref.current.position.x += step * cos(angle.current);
                ref.current.position.y += step * sin(angle.current);
            } else {
                if (ref.current.position.x < -0.5 * width) {
                    ref.current.position.x = 0.5 * width;
                } else if (ref.current.position.x > 0.5 * width) {
                    ref.current.position.x = -0.5 * width;
                }

                if (ref.current.position.y < -0.5 * height) {
                    ref.current.position.y = 0.5 * height;
                } else if (ref.current.position.y > 0.5 * height) {
                    ref.current.position.y = -0.5 * height;
                }
                angle.current += Math.random() - 0.5;

                // const [x, y] = rndPos();
                // ref.current.position.set(x, y, 0);
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
            value: 10,
            step: 1,
            max: 5000,
        },
        scale: 10,
        step: 0.02,
        pause: false,
    });

    const points = range(0, numPoints);

    return (
        <Points limit={5000}>
            {/* @ts-ignore */}
            <PointMaterial scale={scale} depthWrite={false} />
            {points.map((i) => (
                <MyPoint key={i} index={i} step={step} pause={pause} />
            ))}
        </Points>
    );
}

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
                <FrameExporter prefix="CS.20" />
                <NoAutoClear />
                <group scale-x={0.8} scale-y={0.8}>
                    <NoiseGrid>
                        {/* <DrawNoiseLines color={stroke} /> */}
                        <MyPoints />
                    </NoiseGrid>
                </group>
            </Canvas>
        </SketchSize>
    );
}
