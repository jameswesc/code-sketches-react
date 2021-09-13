import { styled } from '@/stitches.config';

export const Input = styled('input', {
    backgroundColor: '$whiteA7',
    color: 'black',
    paddingLeft: '$1',
    fontFamily: '$supply',
    outline: 'none',

    '&:hover': {
        backgroundColor: '$whiteA8',
        border: '1px solid $indigo10',
    },
    '&:focus': {
        border: '1px solid $indigo11',
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
