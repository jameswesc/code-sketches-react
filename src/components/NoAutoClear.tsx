import { useSeed } from '@/features/seed';
import { useFrame } from '@react-three/fiber';
import { useState, useEffect } from 'react';

export function NoAutoClear() {
    const seed = useSeed();
    const [cleared, setCleared] = useState(false);

    useEffect(() => {
        setCleared(false);
    }, [seed, setCleared]);

    useFrame(({ gl, scene, camera }) => {
        if (!cleared) {
            gl.autoClear = true;
            gl.autoClearColor = true;
            setCleared(true);
        } else {
            gl.autoClear = false;
            gl.autoClearColor = false;
        }
    }, -1);

    return null;
}
