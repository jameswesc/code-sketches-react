import { styled } from '@/stitches.config';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

export const Checkbox = styled(CheckboxPrimitive.Root, {
    all: 'unset',

    backgroundColor: '$indigo3',
    width: 15,
    height: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 2px 10px $blackA7`,
    cursor: 'pointer',

    '&:hover': { backgroundColor: '$indigo5' },
    '&:focus': { boxShadow: `0 0 0 2px $indigo12` },
});

export const CheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
    all: 'unset',

    bg: '$indigo11',
    color: 'white',
});
