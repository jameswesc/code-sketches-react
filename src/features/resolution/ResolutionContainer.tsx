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

// COULDNT QUITE GET THIS WORKING
// const SetResolutionContainer: React.FC<ISize> = ({
//     width,
//     height,
//     children,
// }) => {
//     const [ref, bounds] = useMeasure();
//     const fit = useResolutionStore((s) => s.objectFit);

//     const rect = fitRect(
//         [0, 0, width, height],
//         [0, 0, bounds.width, bounds.height],
//         fit
//     );

//     const sx = rect[2] / width;
//     const sy = rect[3] / height;

//     console.log({ screen: { width, height }, bounds, rect, sx, sy });

//     return (
//         <AbsoluteFill ref={ref}>
//             {bounds.width > 0 && (
//                 <AbsoluteFill
//                     css={{
//                         width,
//                         height,
//                         transform: `scale(${sx}) translate(${rect[0]}px, ${rect[1]}px)`,
//                     }}
//                 >
//                     {children}
//                 </AbsoluteFill>
//             )}
//         </AbsoluteFill>
//     );
// };

export const ResolutionContainer: React.FC<Partial<IResolution>> = ({
    children,
    ...props
}) => {
    // Not sure about this
    useEffect(() => {
        Object.entries(props).forEach(([k, v]) => {
            if (v !== undefined) {
                // @ts-ignore
                useResolutionStore.setState({ [k]: v });
            }
        });
    }, []);

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
        return <AbsoluteFill css={{ width, height }}>{children}</AbsoluteFill>;
    }

    return null;
};
