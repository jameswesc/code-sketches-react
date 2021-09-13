import React from 'react';
import { SeedRandom, SeedReset, SeedInput } from '@/features/seed';
import { DownloadFrameButton } from '@/features/frameExporter';
import { styled } from '@/stitches.config';
import { ControlsRoot } from '@/features/controlsGroup';
import { ResolutionControls } from '@/features/resolution';

const Grid = styled('div', {
    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: 'auto auto 1fr auto',
    gap: '$1',
});

export function Controls() {
    return (
        <ControlsRoot css={{ bg: '$whiteA8' }}>
            <Grid>
                <SeedReset />
                <SeedRandom />
                <SeedInput />
                <DownloadFrameButton prefix="cs" />
            </Grid>
            <>
                <ResolutionControls />
            </>
        </ControlsRoot>
    );
}
