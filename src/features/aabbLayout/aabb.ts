import { add3, mulN3, Vec } from '@thi.ng/vectors';
import { IAABB } from './types';

export class AABB implements IAABB {
    position: Vec;
    size: Vec;
    min: Vec;
    max: Vec;

    constructor(position?: Vec, size?: Vec) {
        this.position = position || [0, 0, 0];
        this.size = size || [1, 1, 1];
        this.min = add3([], this.position, mulN3([], this.size, -0.5));
        this.max = add3([], this.position, mulN3([], this.size, 0.5));
    }

    intersectsWith(bounds: AABB) {
        return intersectAABB_AABB(this.min, this.max, bounds.min, bounds.max);
    }
}

function intersectAABB_AABB(aMin: Vec, aMax: Vec, bMin: Vec, bMax: Vec) {
    return (
        aMin[0] <= bMax[0] &&
        aMax[0] >= bMin[0] &&
        aMin[1] <= bMax[1] &&
        aMax[1] >= bMin[1] &&
        aMin[2] <= bMax[2] &&
        aMax[2] >= bMin[2]
    );
}
