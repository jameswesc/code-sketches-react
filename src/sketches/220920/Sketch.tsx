import React, { useMemo } from 'react';
import { useSeededColorPalette } from '@/features/colorPalette';
import { SketchSize } from '@/components/SketchSize';
import { IsometricRotation } from '@/components/IsometricRotation';
import { FrameExporter } from '@/features/frameExporter';
import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls, Plane } from '@react-three/drei';
import { useSeed } from '@/features/seed';
import { XY, XYZ } from '@/types/xyz';
import { Smush32 } from '@thi.ng/random';
import { useControls } from 'leva';
import { groups, range } from 'd3-array';
import { makeNoise2D, Noise2D } from 'open-simplex-noise/lib/2d';

interface IRect {
    position: XY;
    size: XY;
}

interface IMinMax {
    min: XY;
    max: XY;
}

function getMimMax({ position: [px, py], size: [sx, sy] }: IRect): IMinMax {
    return {
        min: [px - 0.5 * sx, py - 0.5 * sy],
        max: [px + 0.5 * sx, py + 0.5 * sy],
    };
}

function intersectRect(a: IRect, b: IRect) {
    const { min: aMin, max: aMax } = getMimMax(a);
    const { min: bMin, max: bMax } = getMimMax(b);

    return (
        aMin[0] <= bMax[0] &&
        aMax[0] >= bMin[0] &&
        aMin[1] <= bMax[1] &&
        aMax[1] >= bMin[1]
    );
}

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

function LineRect({
    minMax: {
        min: [x1, z1],
        max: [x2, z2],
    },
    index,
}: {
    minMax: IMinMax;
    index: number;
}) {
    const { step, frequency, amplitude, yStep, mod } = useControls(
        'Line Rect',
        {
            step: 0.2,
            frequency: 0.5,
            amplitude: 1,
            yStep: 0.25,
            mod: {
                value: 4,
                min: 1,
                max: 5,
                step: 1,
            },
        }
    );

    const theme = useSeededColorPalette();
    const stroke = theme[1 + (index % mod)];

    const seed = useSeed();

    const { xLines, zLines, c11, c12, c22, c21, xMax, zMax, baseY } =
        useMemo(() => {
            const rnd = new Smush32(seed + index);
            const baseY = rnd.minmax(0.5, 3);

            const xs = range(x1, x2, step);
            // .concat(x2);
            const zs = range(z1, z2, step);
            // .concat(z2);

            const noise = makeNoise2D(seed);

            const lineData: XYZ[] = [];

            let c11 = baseY,
                c12 = baseY,
                c21 = baseY,
                c22 = baseY;

            for (let xi = 0; xi < xs.length; xi++) {
                for (let zi = 0; zi < zs.length; zi++) {
                    let x = xs[xi];
                    let z = zs[zi];

                    let y = noise(x * frequency, z * frequency) * amplitude;
                    y = y > 0 ? baseY + y : baseY;

                    if (xi === 0 && zi === 0) {
                        c11 = y;
                    } else if (xi === 0 && zi === zs.length - 1) {
                        c12 = y;
                    } else if (xi === xs.length - 1 && zi === 0) {
                        c21 = y;
                    } else if (xi === xs.length - 1 && zi === zs.length - 1) {
                        c22 = y;
                    }

                    lineData.push([x, y, z]);
                }
            }

            console.log(baseY, c11, c12, c22, c21);

            return {
                xLines: groups(lineData, (d) => d[0]).map((d) => d[1]),
                zLines: groups(lineData, (d) => d[2]).map((d) => d[1]),
                c11,
                c22,
                c12,
                c21,
                xMax: xs[xs.length - 1],
                zMax: zs[zs.length - 1],
                baseY,
            };
        }, [x1, z1, x2, z2, step, seed, index, frequency, amplitude]);

    const ys = range(0.25, baseY, 0.25);

    return (
        <group>
            {ys.map((y, i) => (
                <Line
                    points={[
                        // [x1, y, z1],
                        [x1, y, zMax],
                        [xMax, y, zMax],
                        [xMax, y, z1],
                        // [x1, y, z1],
                    ]}
                    color={stroke}
                    lineWidth={0.25}
                />
            ))}

            <Line
                points={[
                    // [x1, 0, z1],
                    [x1, 0, zMax],
                    [xMax, 0, zMax],
                    [xMax, 0, z1],
                    // [x1, 0, z1],
                ]}
                color={stroke}
            />

            {/* <Line
                points={[
                    [x1, 0, z1],
                    [x1, c11, z1],
                ]}
                color={stroke}
            /> */}
            <Line
                points={[
                    [xMax, 0, zMax],
                    [xMax, c22, zMax],
                ]}
                color={stroke}
            />
            <Line
                points={[
                    [xMax, 0, z1],
                    [xMax, c21, z1],
                ]}
                color={stroke}
            />
            <Line
                points={[
                    [x1, 0, zMax],
                    [x1, c12, zMax],
                ]}
                color={stroke}
            />
            {xLines.map((points, i) => (
                <Line key={'xline-' + i} points={points} color={stroke} />
            ))}
            {zLines.map((points, i) => (
                <Line key={'xzline-' + i} points={points} color={stroke} />
            ))}
        </group>
    );
}

function Rectangles() {
    const seed = useSeed();

    const { scale, size, trials } = useControls('Rectangles', {
        scale: {
            value: 10,
            min: 0,
        },
        size: {
            value: 10,
            min: 1,
        },
        trials: {
            value: 50,
            min: 0,
            step: 1,
        },
    });

    const rects: IRect[] = useMemo(() => {
        const rnd = new Smush32(seed);

        function rndPos(): XY {
            return [rnd.minmax(-scale, scale), rnd.minmax(-scale, scale)];
        }

        function rndSize(): XY {
            return [rnd.minmax(0.5, size), rnd.minmax(0.5, size)];
        }

        function rndRect(): IRect {
            return {
                position: rndPos(),
                size: rndSize(),
            };
        }

        const rects: IRect[] = [];

        for (let i = 0; i < trials; i++) {
            const newRect = rndRect();
            if (!rects.find((r) => intersectRect(r, newRect))) {
                rects.push(newRect);
            }
        }

        return rects;
    }, [seed, scale, size, trials]);

    return (
        <group>
            {rects.map((rect, i) => (
                <LineRect key={i} index={i} minMax={getMimMax(rect)} />
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
            >
                <color attach="background" args={[bg]} />
                <FrameExporter prefix="CS.15" />
                <IsometricRotation>
                    <Rectangles />
                </IsometricRotation>
                <OrbitControls />
            </Canvas>
        </SketchSize>
    );
}
