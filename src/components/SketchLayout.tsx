import React from 'react';
import { styled } from '@/stitches.config';
import { ReactNode } from 'react';
import { DefaultControls } from './DefaultControls';

const Fullscreen = styled('div', {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
});

const Controls = styled('div', {
    position: 'fixed',
    top: '$2',
    left: '$2',
});

interface ILayout {
    sketch: ReactNode;
    controls?: ReactNode;
}

export function SketchLayout({ sketch, controls }: ILayout): JSX.Element {
    return (
        <>
            <Fullscreen>{sketch}</Fullscreen>
            <Controls>{controls ? controls : <DefaultControls />}</Controls>
        </>
    );
}
