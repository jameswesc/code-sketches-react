import { styled } from '@/stitches.config';

export const Input = styled('input', {
    all: 'unset',

    backgroundColor: '$indigo1',

    border: '1px solid $indigo6',
    color: '$indigo11',

    paddingLeft: 10,

    fontFamily: '$supply',

    '&:hover': {
        backgroundColor: '$indigo3',
        border: '1px solid $indigo7',
    },
    '&:focus': {
        border: '1px solid $indigo4',
    },
});
