import React from 'react';
import { ReactNode } from 'react';

/**
 * https://en.wikipedia.org/wiki/Isometric_projection
 *
 * For example, with a cube, this is done by first looking straight towards one face.
 * Next, the cube is rotated ±45° about the vertical axis, followed by a rotation of
 * approximately 35.264° (precisely arcsin 1⁄√3 or arctan 1⁄√2, which is related to
 * the Magic angle) about the horizontal axis.
 */

export function IsometricRotation({
    children = null,
}: {
    children?: ReactNode;
}) {
    return (
        <group
            rotation-y={-0.25 * Math.PI}
            rotation-x={Math.atan(Math.SQRT1_2)}
        >
            {children}
        </group>
    );
}
