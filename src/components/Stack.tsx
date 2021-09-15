import { styled } from '@/stitches.config';

export const Stack = styled('div', {
    display: 'grid',

    variants: {
        gap: {
            xs: {
                gap: '$1',
            },
            sm: {
                gap: '$2',
            },
            md: {
                gap: '$3',
            },
            lg: {
                gap: '$4',
            },
        },
    },
});
