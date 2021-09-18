import { styled } from '@/stitches.config';

export const IconButton = styled('button', {
    width: 30,
    height: 30,

    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',

    backgroundColor: '$bg',
    border: '1px solid $line',

    '&:hover': {
        backgroundColor: '$bgHover',
        border: '1px solid $lineHover',
    },
    '&:focus': {
        backgroundColor: '$bgFocus',
        border: '1px solid $lineFocus',
        outline: 'none',
    },
    '&:disabled': {
        opacity: 0.3,
    },
});
