import React from 'react';
import { IconButton } from '@/components/IconButton';
import { DownloadIcon } from '@radix-ui/react-icons';
import { useDownloadNextFrame } from '.';
import { useSeed } from '../seed';

export function DownloadFrameButton({ prefix }: { prefix?: string }) {
    const seed = useSeed();
    const downloadNextFrame = useDownloadNextFrame();

    return (
        <IconButton
            onClick={() => {
                downloadNextFrame(`${prefix + '-'}${seed}.png`);
            }}
        >
            <DownloadIcon />
        </IconButton>
    );
}
