import React from 'react';
import { SeedRandom, SeedReset, SeedInput } from '@/features/seed';
import { DownloadFrameButton } from '@/features/frameExporter';
import { styled } from '@/stitches.config';
import { AABBControls } from '@/features/aabbLayout';

const Grid = styled('div', {
    display: 'grid',
    gridAutoFlow: 'column',
    gap: '$1',
});

export function Controls() {
    return (
        <>
            <Grid>
                <SeedReset />
                <SeedRandom />
                <SeedInput />
                <DownloadFrameButton prefix="cs" />
            </Grid>
            {/* <AABBControls /> */}
        </>
    );
}
