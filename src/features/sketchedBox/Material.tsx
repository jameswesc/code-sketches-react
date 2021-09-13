import React from 'react';
import Material from 'component-material';
import { srgb } from '@thi.ng/color';
import { MeshBasicMaterial } from 'three';

interface IPlaneMaterial {
    color: string;
    size?: [number, number];
    strokeColor?: string;
    topWidth?: number;
    bottomWidth?: number;
    leftWidth?: number;
    rightWidth?: number;
}

const colorToVec = (cs: string) => {
    const c = srgb(cs);
    return [c.r, c.g, c.b];
};

export function PlaneMaterial({
    color,
    strokeColor,
    size = [1, 1],
    topWidth = 0,
    bottomWidth = 0,
    leftWidth = 0,
    rightWidth = 0,
}: IPlaneMaterial) {
    const u_color = colorToVec(color);
    const u_stroke = colorToVec(strokeColor || color);

    return (
        // @ts-ignore
        <Material
            key="xplane-material"
            from={MeshBasicMaterial}
            uniforms={{
                u_color: {
                    value: u_color,
                    type: 'vec3',
                },
                u_stroke: {
                    value: u_stroke,
                    type: 'vec3',
                },
                u_top: {
                    value: topWidth,
                    type: 'float',
                },
                u_bottom: {
                    value: bottomWidth,
                    type: 'float',
                },
                u_left: {
                    value: leftWidth,
                    type: 'float',
                },
                u_right: {
                    value: rightWidth,
                    type: 'float',
                },
                u_size: {
                    value: size,
                    type: 'vec2',
                },
            }}
            varyings={{
                v_uv: { type: 'vec2' },
                v_xy: { type: 'vec2' },
            }}
        >
            <Material.Vert.Body>
                {`
                v_uv = uv;
                v_xy = uv * u_size;
                `}
            </Material.Vert.Body>
            <Material.Frag.Body>
                {`
                float left = smoothstep(0.9 * u_left, 1.1 * u_left, v_xy.x);
                float bottom = smoothstep(0.9 * u_bottom, 1.1 * u_bottom, v_xy.y);
                float right = smoothstep(0.9 * u_right, 1.1 * u_right, u_size.x - v_xy.x);                
                float top = smoothstep(0.9 * u_top, 1.1 * u_top, u_size.y - v_xy.y);
                
                float drawColor = bottom * top * left * right;


                // float middle1 = step(0.3, v_uv.x);
                // float middle2 = step(0.68, 1.0 - v_uv.x);
                // drawColor *= abs(middle1 * middle2 - 1.0);
                
                vec3 color = mix(u_stroke, u_color, vec3(drawColor));
                gl_FragColor = vec4(color, 1.0);
                `}
            </Material.Frag.Body>
        </Material>
    );
}
