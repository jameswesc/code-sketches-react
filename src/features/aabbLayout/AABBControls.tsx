import React from 'react';
import { Stack } from '@/components/Stack';
import { useControls } from 'leva';
import { useEffect } from 'react';
import { useAABBControls } from './store';
import { Type } from '@/components/Type';

export function AABBControls() {
    const {} = useAABBControls();

    // const controls = useControls({
    //     layers: 3,
    //     trials: 20,
    //     trialsFactor: 2,
    //     minSize: 0.6,
    //     maxSize: 6,
    //     sizeFactor: 0.5,
    //     scale: 10,
    //     scaleFactor: 1,
    // });

    return (
        <Stack gap="sm">
            <Type>AABB Layout</Type>
        </Stack>
    );
}
