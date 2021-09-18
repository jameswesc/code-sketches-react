import { styled } from '@/stitches.config';

export const Input = styled('input', {
    backgroundColor: '$bg',
    color: 'black',
    paddingLeft: '$1',
    fontFamily: '$supply',
    outline: 'none',
    border: '1px solid $line',

    '&:hover': {
        backgroundColor: '$bgHover',
        border: '1px solid $lineHover',
    },
    '&:focus': {
        backgroundColor: '$bgFocus',
        border: '1px solid $lineFocus',
    },

    variants: {
        size: {
            base: {
                height: 30,
                fontSize: '1rem',
            },

            sm: {
                height: 20,
                fontSize: '.7rem',
            },
        },

        width: {
            full: {
                width: '100%',
            },
            half: {
                width: '50%',
            },
            third: {
                width: '33%',
            },
            twoThirds: {
                width: '66%',
            },
            qrtr: {
                width: '25%',
            },
            threeQrtr: {
                width: '75%',
            },
        },
    },

    defaultVariants: {
        size: 'base',
        width: 'full',
    },
});
