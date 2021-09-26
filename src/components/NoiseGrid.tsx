import React from 'react';
import { useSeed } from '@/features/seed';
import { XY } from '@/types/xyz';
import { useThree } from '@react-three/fiber';
import { range } from 'd3-array';
import { useControls } from 'leva';
import { makeNoise2D } from 'open-simplex-noise';
import { createContext, useContext, ReactNode, useMemo } from 'react';

export interface ICell {
    center: XY;
    angle: number;
}

export interface IGrid {
    grid: ICell[][];
    radius: number;
    size: XY;
}

const GridContext = createContext<IGrid>(undefined as any);

export const useGrid = () => useContext(GridContext);

export function NoiseGrid({ children }: { children?: ReactNode }) {
    const { width, height } = useThree((s) => s.viewport);

    const { rowsAndColumns, frequency } = useControls('Noise Grid', {
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
                    angle: Math.PI * noise(x * frequency, y * frequency),
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
