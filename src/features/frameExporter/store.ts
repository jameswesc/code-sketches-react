import create from 'zustand';

interface IStore {
    flag: boolean;
    filename?: string;
    downloadNextFrame(filename?: string): void;
    clear(): void;
}

export const useStore = create<IStore>((set) => ({
    flag: false,
    downloadNextFrame(filename) {
        set({ flag: true, filename });
    },
    clear() {
        set({ flag: false, filename: undefined });
    },
}));

export const useDownloadNextFrame = () => useStore((s) => s.downloadNextFrame);
