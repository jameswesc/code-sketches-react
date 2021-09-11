import React from 'react';
import { useThree } from '@react-three/fiber';
import { FC } from 'react';

/**
 * Scales its children to fit a square plane of size units
 * to fit the viewport.
 */

export const ScaleToFit: FC<{ size?: number }> = ({ children, size = 10 }) => {
    const viewport = useThree((s) => s.viewport);
    const viewportSize = Math.min(viewport.width, viewport.height);

    const scaleFactor = viewportSize / size;

    return <group scale={scaleFactor}>{children}</group>;
};
