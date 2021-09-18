import { useFrame } from '@react-three/fiber';
import canvasScreenshot from 'canvas-screenshot';
import { useSeedStore } from '../seed/store';
import { useStore } from './store';

export function FrameExporter({ prefix }: { prefix?: string }): null {
    const clear = useStore((s) => s.clear);

    // This loop is needed in case there are no
    // postprocessing effects
    useFrame(({ gl, scene, camera }) => {
        gl.render(scene, camera);
    }, 1);

    // If there are post processing effects, we
    // need to grab the screnshot after they've been
    // applied. By using a render priority of 10,
    // that should do the job (default render priority of
    // effect composer is 1).
    useFrame(({ gl }) => {
        if (useStore.getState().flag) {
            // ([prefix]-)?[seed].png
            const filename = `${prefix ? prefix + '-' : ''}${
                useSeedStore.getState().seed
            }.png`;

            canvasScreenshot(gl.domElement, {
                filename,
            });
            clear();
        }
    }, 10);

    return null;
}
