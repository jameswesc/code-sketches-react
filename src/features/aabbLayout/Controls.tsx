import { useControls } from 'leva';
import { useEffect } from 'react';
import { useAABBControls } from './store';

export function Controls() {
    const set = useAABBControls((s) => s.set);

    const controls = useControls({
        layers: 3,
        trials: 20,
        trialsFactor: 2,
        minSize: 0.6,
        maxSize: 6,
        sizeFactor: 0.5,
        scale: 10,
        scaleFactor: 1,
    });
    useEffect(() => void set(controls), [set, controls]);

    return null;
}
