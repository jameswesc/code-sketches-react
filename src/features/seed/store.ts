import create, { UndoState } from 'zundo';
import { SYSTEM } from '@thi.ng/random';

function randInt() {
    return Math.floor(SYSTEM.float(0xffffff));
}

interface ISeedStore extends UndoState {
    seed: number;
    setSeed(seed: number): void;
    newSeed(): void;
}

export const useSeedStore = create<ISeedStore>((set) => ({
    seed: randInt(),
    setSeed(seed) {
        set({ seed });
    },
    newSeed() {
        set({ seed: randInt() });
    },
}));

export const useSeed = () => useSeedStore((s) => s.seed);
