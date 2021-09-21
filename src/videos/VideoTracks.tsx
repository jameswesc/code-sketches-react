import { Leva, useControls } from 'leva';
import React from 'react';
import { Composition } from 'remotion';
import { AV1, IAV1 } from './av1/index';

export const VideoTracks: React.FC = () => {
    const { videoSeed } = useControls('Seed', { videoSeed: 87 });

    return (
        <>
            <Composition<IAV1>
                id="av1"
                component={AV1}
                durationInFrames={30 * 6}
                fps={30}
                width={600}
                height={600}
                defaultProps={{
                    videoSeed,
                }}
            />
        </>
    );
};
