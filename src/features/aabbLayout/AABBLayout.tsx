import React, { FunctionComponent } from 'react';
import { Smush32 } from '@thi.ng/random';
import { useMemo } from 'react';
import { useSeed } from '../seed';
import { AABB } from './aabb';
import { IAABB } from './types';
import { makeRandPosFn, makeRandomSizeFn } from './utils';
import { useControls } from 'leva';

export type AABBComponentProps = IAABB & { index: number };

export function AABBLayout({
    component,
}: {
    component: FunctionComponent<AABBComponentProps>;
}) {
    const seed = useSeed();

    const {
        layers,
        trials,
        minSize,
        maxSize,
        sizeFactor,
        scaleFactor,
        trialsFactor,
        scale,
    } = useControls(
        'AABB Layout',
        {
            layers: {
                value: 1,
                min: 1,
                max: 10,
                step: 1,
            },
            trials: {
                value: 40,
                min: 1,
            },
            minSize: {
                value: 0.1,
                min: 0,
            },
            maxSize: {
                value: 6,
                min: 0,
            },
            sizeFactor: {
                value: 1,
                min: 0,
            },
            scaleFactor: {
                value: 1,
                min: 0,
            },
            scale: {
                value: 10,
                min: 0,
            },
            trialsFactor: {
                value: 1,
                min: 0,
            },
        },
        { collapsed: true }
    );

    const bounds: AABB[] = useMemo(() => {
        const rnd = new Smush32(seed);

        const bounds: AABB[] = [];

        for (let l = 0; l < layers; l++) {
            const maxTrials = trials * trialsFactor ** l;
            const min = minSize * sizeFactor ** l;
            const max = maxSize * sizeFactor ** l;
            const maxScale = scale * scaleFactor ** l;

            const randomPosition = makeRandPosFn(maxScale, rnd);
            const randomSize = makeRandomSizeFn(min, max, rnd);

            for (let t = 0; t < maxTrials; t++) {
                const newBounds = new AABB(randomPosition(), randomSize());

                if (!bounds.find((b) => b.intersectsWith(newBounds))) {
                    bounds.push(newBounds);
                }
            }
        }

        return bounds;
    }, [
        layers,
        trials,
        trialsFactor,
        minSize,
        sizeFactor,
        maxSize,
        scale,
        scaleFactor,
        seed,
    ]);

    return (
        <group>
            {bounds.map((b, i) => (
                <group key={`aabb-${i}`}>
                    {React.createElement(component, {
                        position: b.position,
                        size: b.size,
                        min: b.min,
                        max: b.max,
                        index: i,
                    })}
                </group>
            ))}
        </group>
    );
}
