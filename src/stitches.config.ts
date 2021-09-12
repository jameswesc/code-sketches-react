import { gray, indigo, pink, blackA, whiteA } from '@radix-ui/colors';
import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react';

export const { styled, globalCss } = createStitches({
    theme: {
        colors: {
            ...gray,
            ...indigo,
            ...pink,

            ...blackA,
            ...whiteA,
        },
        space: {
            1: '5px',
            2: '10px',
            3: '15px',
            4: '20px',
        },
        fonts: {
            supply: `'Supply', monospace`,
            objectSans: `'Object Sans', sans-serif`,
        },
    },
    utils: {
        bg(value: Stitches.PropertyValue<'backgroundColor'>) {
            return {
                backgroundColor: value,
            };
        },
        p(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingTop: value,
                paddingBottom: value,
                paddingLeft: value,
                paddingRight: value,
            };
        },
        py(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingTop: value,
                paddingBottom: value,
            };
        },
        px(value: Stitches.PropertyValue<'padding'>) {
            return {
                paddingLeft: value,
                paddingRight: value,
            };
        },
        m(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginTop: value,
                marginBottom: value,
                marginLeft: value,
                marginRight: value,
            };
        },
        my(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginTop: value,
                marginBottom: value,
            };
        },
        mx(value: Stitches.PropertyValue<'margin'>) {
            return {
                marginLeft: value,
                marginRight: value,
            };
        },
    },
});
