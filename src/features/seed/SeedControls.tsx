import React from 'react';
import { IconButton } from '@/components/IconButton';
import { ResetIcon, UpdateIcon } from '@radix-ui/react-icons';
import { useSeedStore } from './store';
import { Input } from '@/components/Input';

export function SeedRandom(): JSX.Element {
    const newSeed = useSeedStore((s) => s.newSeed);
    return (
        <IconButton onClick={newSeed}>
            <UpdateIcon />
        </IconButton>
    );
}

export function SeedReset(): JSX.Element {
    const undo = useSeedStore((s) => s.undo);
    return (
        <IconButton onClick={undo} disabled={undo === undefined}>
            <ResetIcon />
        </IconButton>
    );
}

export function SeedInput(): JSX.Element {
    const { seed, setSeed } = useSeedStore();

    return (
        <Input
            type="number"
            value={seed}
            onChange={(e) => {
                const num = Math.floor(+e.target.value);
                if (isNaN(num)) {
                    setSeed(0);
                } else {
                    setSeed(num);
                }
            }}
        />
    );
}
