import { THEMES } from '@thi.ng/color-palettes';
import { Smush32 } from '@thi.ng/random';
import { useMemo } from 'react';
import { useSeed } from '../seed';

const themes = Object.values(THEMES);

export const useSeededColorPalette = () => {
    const seed = useSeed();

    return useMemo(() => {
        const rnd = new Smush32(seed);
        const index = Math.floor(rnd.float(themes.length));

        return themes[index];
    }, [seed]);
};
