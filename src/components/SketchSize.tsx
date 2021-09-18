import React from 'react';
import { styled } from '@/stitches.config';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import { useControls } from 'leva';

const AbsoluteFill = styled('div', {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
});

type Mode = 'screen' | 'aspect-ratio' | 'set';

interface ISketchSize {
    mode?: Mode;
    ratio?: number;
    width?: number;
    height?: number;
}

export const SketchSize: React.FC<ISketchSize> = ({
    children,
    mode: initialMode = 'screen',
    ratio: initialRatio = 1,
    height: initialHeight = 400,
    width: initialWidth = 400,
}) => {
    const { mode, ratio, width, height } = useControls(
        'Sketch Size',
        {
            mode: {
                value: initialMode,
                options: ['screen', 'aspect-ratio', 'set'] as Mode[],
            },
            ratio: initialRatio,
            width: initialWidth,
            height: initialHeight,
        },
        { collapsed: true }
    );

    if (mode === 'screen') {
        return <AbsoluteFill>{children}</AbsoluteFill>;
    } else if (mode === 'aspect-ratio') {
        return (
            <AbsoluteFill>
                <AspectRatio.Root ratio={ratio}>{children}</AspectRatio.Root>
            </AbsoluteFill>
        );
    } else if (mode === 'set') {
        return <AbsoluteFill css={{ width, height }}>{children}</AbsoluteFill>;
    }

    return null;
};
