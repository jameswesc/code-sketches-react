import { useFrame } from '@react-three/fiber';
import canvasScreenshot from 'canvas-screenshot';
import { useStore } from './store';

export function FrameExporter(): null {
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
            canvasScreenshot(gl.domElement, {
                filename: useStore.getState().filename,
            });
            clear();
        }
    }, 10);

    return null;
}
