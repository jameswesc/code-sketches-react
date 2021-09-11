import { styled } from '@/stitches.config';

export const IconButton = styled('button', {
    width: 30,
    height: 30,

    backgroundColor: '$indigo4',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid $indigo6',
    color: '$indigo11',

    '&:hover': {
        backgroundColor: '$indigo5',
        border: '1px solid $indigo7',
    },
    '&:focus': {
        border: '1px solid $indigo11',
    },
    '&:disabled': {
        opacity: 0.3,
    },
});
