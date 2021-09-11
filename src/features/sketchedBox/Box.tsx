import React, { forwardRef, ReactNode } from 'react';
import { Group } from 'three';
import { Plane } from '@react-three/drei';
import { PlaneMaterial } from './Material';
import { XYZ } from '@/types/xyz';

interface IPlane {
    size: number[];
    children?: ReactNode;
    doubleSided?: boolean;
}

function XPlane({ size: [w, h, d], children, doubleSided }: IPlane) {
    return (
        <>
            <Plane
                args={[d, h]}
                rotation-y={0.5 * Math.PI}
                position-x={0.5 * w}
            >
                {children}
            </Plane>
            {doubleSided && (
                <Plane
                    args={[d, h]}
                    rotation-y={-0.5 * Math.PI}
                    position-x={-0.5 * w}
                >
                    {children}
                </Plane>
            )}
        </>
    );
}

function YPlane({ size: [w, h, d], children, doubleSided }: IPlane) {
    return (
        <>
            <Plane
                args={[w, d]}
                rotation-x={-0.5 * Math.PI}
                position-y={0.5 * h}
            >
                {children}
            </Plane>
            {doubleSided && (
                <Plane
                    args={[w, d]}
                    rotation-x={0.5 * Math.PI}
                    position-y={-0.5 * h}
                >
                    {children}
                </Plane>
            )}
        </>
    );
}

function ZPlane({ size: [w, h, d], children, doubleSided }: IPlane) {
    return (
        <>
            <Plane args={[w, h]} position-z={0.5 * d}>
                {children}
            </Plane>
            {doubleSided && (
                <Plane args={[w, h]} rotation-y={Math.PI} position-z={-0.5 * d}>
                    {children}
                </Plane>
            )}
        </>
    );
}

interface ISketchBox {
    size?: XYZ;
    innerStrokeWidth?: number;
    outerStrokeWidth?: number;
    xColor?: string;
    yColor?: string;
    zColor?: string;
    strokeColor?: string;
    doubleSided?: boolean;
}

type SketechedBoxProps = ISketchBox & JSX.IntrinsicElements['group'];

export const SketchedBox = forwardRef(
    (
        {
            innerStrokeWidth,
            outerStrokeWidth,
            size = [1, 1, 1],
            xColor = '#ff0000',
            yColor = '#00ff00',
            zColor = '#0000ff',
            strokeColor,
            doubleSided,
            ...props
        }: SketechedBoxProps,
        ref
    ) => {
        const [w, h, d] = size;

        return (
            <group ref={ref as React.MutableRefObject<Group>} {...props}>
                <XPlane size={size} doubleSided={doubleSided}>
                    <PlaneMaterial
                        color={xColor}
                        size={[d, h]}
                        strokeColor={strokeColor}
                        bottomWidth={outerStrokeWidth}
                        topWidth={innerStrokeWidth}
                        leftWidth={innerStrokeWidth}
                        rightWidth={outerStrokeWidth}
                    />
                </XPlane>

                <YPlane size={size} doubleSided={doubleSided}>
                    <PlaneMaterial
                        color={yColor}
                        size={[w, d]}
                        strokeColor={strokeColor}
                        bottomWidth={innerStrokeWidth}
                        topWidth={outerStrokeWidth}
                        leftWidth={outerStrokeWidth}
                        rightWidth={innerStrokeWidth}
                    />
                </YPlane>

                <ZPlane size={size} doubleSided={doubleSided}>
                    <PlaneMaterial
                        color={zColor}
                        size={[w, h]}
                        strokeColor={strokeColor}
                        bottomWidth={outerStrokeWidth}
                        topWidth={innerStrokeWidth}
                        leftWidth={outerStrokeWidth}
                        rightWidth={innerStrokeWidth}
                    />
                </ZPlane>
            </group>
        );
    }
);

SketchedBox.displayName = 'Sketched Box';
