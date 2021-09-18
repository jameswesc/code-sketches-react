import create from 'zustand';

interface IStore {
    flag: boolean;
    downloadNextFrame(): void;
    clear(): void;
}

export const useStore = create<IStore>((set) => ({
    flag: false,
    downloadNextFrame() {
        set({ flag: true });
    },
    clear() {
        set({ flag: false });
    },
}));

export const useDownloadNextFrame = () => useStore((s) => s.downloadNextFrame);
