import React, { FunctionComponent } from 'react';
import { Smush32 } from '@thi.ng/random';
import { useMemo } from 'react';
import { useSeed } from '../seed';
import { AABB } from './aabb';
import { IAABB } from './types';
import { makeRandPosFn, makeRandomSizeFn } from './utils';
import { useAABBControls } from './store';

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
    } = useAABBControls();

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
