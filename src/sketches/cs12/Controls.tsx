import React from 'react';
import { SeedRandom, SeedReset, SeedInput } from '@/features/seed';
import { DownloadFrameButton } from '@/features/frameExporter';
import { styled } from '@/stitches.config';
import { ControlsRoot } from '@/features/controlsGroup';

const ControlGrid = styled('div', {
    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: 'auto auto 1fr auto',
    gap: '$1',
});

export function Controls() {
    return (
        <ControlsRoot>
            <ControlGrid>
                <SeedReset />
                <SeedRandom />
                <SeedInput />
                <DownloadFrameButton prefix="cs" />
            </ControlGrid>
        </ControlsRoot>
    );
}
