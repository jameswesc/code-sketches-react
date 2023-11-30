import React, {
    MutableRefObject,
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
    finish: boolean;
}

// function DrawNoiseLines({ color = '#ffffff' }: { color?: string }) {
//     const { show } = useControls('Noise Lines', {
//         show: true,
//     });

//     const { grid, radius } = useGrid();

//     const cells = useMemo(() => {
//         return grid.flatMap((d) => d);
//     }, [grid]);

//     return (
//         <group>
//             {show &&
//                 cells.map(({ center: [cx, cy], angle }, i) => (
//                     <group key={i} position-x={cx} position-y={cy}>
//                         <Line
//                             points={[
//                                 [radius * cos(angle), radius * sin(angle), 0],
//                                 [-radius * cos(angle), -radius * sin(angle), 0],
//                             ]}
//                             color={color}
//                             lineWidth={0.2}
//                         />
//                     </group>
//                 ))}
//         </group>
//     );
// }

function MyPoint({ index, step, finish }: IPoint) {
    const seed = useSeed();
    const theme = useSeededColorPalette();

    const color = theme[index % 6];

    const { width, height } = useThree((s) => s.viewport);
    const [draw, setDraw] = useState(false);

    const {
        grid,
        size: [xStep, yStep],
    } = useGrid();

    useEffect(() => {
        setDraw(false);
    }, [seed, setDraw]);

    const xLimit = grid.length - 1;
    const yLimit = grid[0].length - 1;

    const rndPos = useMemo(() => {
        const rnd = new Smush32(seed + index);
        const rx = uniform(rnd, -0.5 * width, 0.5 * width);
        const ry = uniform(rnd, -0.5 * height, 0.5 * height);
        return () => [rx(), ry()] as XY;
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

    const initialPosition = useMemo(() => rndPos(), [rndPos]);

    const ixy = getIndex(initialPosition[0], initialPosition[1]);
    const initFlowAngle = ixy ? grid[ixy[0]][ixy[1]].angle : 0;

    const rndAngle = useCallback(() => {
        const rnd = new Smush32(seed);
        // return rnd.float(0 * Math.PI);
        return rnd.minmax(initFlowAngle - 0.05, initFlowAngle + 0.05);
    }, [seed, index, initFlowAngle]);
    const initAngle = useMemo(() => rndAngle(), [rndAngle]);

    const pointRef = useRef<any>();
    const angle = useRef(initAngle);
    const position = useRef(initialPosition);

    useEffect(() => {
        position.current = initialPosition;
    }, [initialPosition, position]);

    const checkOutOfBounds = useCallback(
        (position: MutableRefObject<XY>) => {
            let [x, y] = position.current;

            let wasOutOfBounds = false;

            if (x < -0.5 * width) {
                position.current[0] = 0.5 * width;
                wasOutOfBounds = true;
            } else if (x > 0.5 * width) {
                position.current[0] = -0.5 * width;
                wasOutOfBounds = true;
            }

            if (y < -0.5 * height) {
                position.current[1] = 0.5 * height;
                wasOutOfBounds = true;
            } else if (y > 0.5 * height) {
                position.current[1] = -0.5 * height;
                wasOutOfBounds = true;
            }

            return wasOutOfBounds;
        },
        [width, height]
    );

    useFrame(() => {
        // Get indexes
        const ixy = getIndex(position.current[0], position.current[1]);

        if (ixy) {
            // Get flow angle
            const flowAngle = grid[ixy[0]][ixy[1]].angle;
            // lerp to it
            angle.current = lerp(angle.current, flowAngle, 0.001);
            // step
            position.current[0] += step * cos(angle.current);
            position.current[1] += step * sin(angle.current);

            let wasOutOfBounds = checkOutOfBounds(position);

            if (wasOutOfBounds) {
                setDraw(true);
                if (finish) {
                    console.log(finish);

                    position.current = [width * 10, height * 10];

                    pointRef.current.position.x = width * 10;
                    pointRef.current.position.y = height * 10;
                } else {
                    pointRef.current.position.x = position.current[0];
                    pointRef.current.position.y = position.current[1];
                }
            } else if (draw) {
                pointRef.current.position.x = position.current[0];
                pointRef.current.position.y = position.current[1];
            } else {
                // else draw offscreen
                pointRef.current.position.x = width * 10;
                pointRef.current.position.y = height * 10;
            }
        } else {
        }
    });

    return (
        // @ts-ignore
        <Point
            ref={pointRef}
            // @ts-ignore
            position={[width * 10, height * 10, 0]}
            color={color}
        />
    );
}

function MyPoints() {
    const { numPoints, scale, step, finish } = useControls('Points', {
        numPoints: {
            value: 10,
            step: 1,
            max: 5000,
        },
        scale: 20,
        step: 0.02,
        finish: false,
    });

    const seed = useSeed();

    const points = range(0, numPoints);

    return (
        <Points limit={5000}>
            {/* @ts-ignore */}
            <PointMaterial scale={scale} depthWrite={false} />
            {points.map((i) => (
                <MyPoint
                    key={`${seed}-${i}`}
                    index={i}
                    step={step}
                    finish={finish}
                />
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
                <FrameExporter prefix="CS21" />
                <NoAutoClear />
                <group scale-x={1.1} scale-y={1.1}>
                    <NoiseGrid>
                        {/* <DrawNoiseLines color={stroke} /> */}
                        <MyPoints />
                    </NoiseGrid>
                </group>
            </Canvas>
        </SketchSize>
    );
}
