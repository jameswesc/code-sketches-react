import { IRandom } from '@thi.ng/random';
import { random3 } from '@thi.ng/vectors';

export function makeRandPosFn(scale: number, rnd: IRandom) {
    return () => random3([], -scale, scale, rnd);
}

export function makeRandomSizeFn(
    minSize: number,
    maxSize: number,
    rnd: IRandom
) {
    return () => random3([], minSize, maxSize, rnd);
}
