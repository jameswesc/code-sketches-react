import React, { useEffect } from 'react';
import { IResolution } from './types';
import { styled } from '@/stitches.config';
import { useResolutionStore } from './store';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';

const AbsoluteFill = styled('div', {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
});

export const ResolutionContainer: React.FC<Partial<IResolution>> = ({
    children,
    ...props
}) => {
    useEffect(() => {
        console.log('SET PROPS!');
    }, [props]);

    const { mode, ratio, width, height } = useResolutionStore();

    if (mode === 'screen') {
        return <AbsoluteFill>{children}</AbsoluteFill>;
    } else if (mode === 'aspect-ratio') {
        return (
            <AbsoluteFill>
                <AspectRatio.Root ratio={ratio}>{children}</AspectRatio.Root>
            </AbsoluteFill>
        );
    } else if (mode === 'set') {
        return (
            <AbsoluteFill
                css={{
                    width,
                    height,
                }}
            >
                {children}
            </AbsoluteFill>
        );
    }

    return null;
};
