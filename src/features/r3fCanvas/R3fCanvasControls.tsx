import React from 'react';
import { styled } from '@/stitches.config';
import { Checkbox, CheckboxIndicator } from '@/components/Checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { useCanvasControls } from './store';
import { Type } from '@/components/Type';
import { Input } from '@/components/Input';

const Stack = styled('div', {
    display: 'grid',
    gap: 5,
    paddingTop: '$1',
});

const ControlRow = styled('div', {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '$1',
    alignItems: 'center',
});

const Label = styled('label', Type);

export function R3fCanvasControls() {
    const { orthographic, zoom, fov, zPos, set } = useCanvasControls();

    return (
        <Stack>
            <Type>Canvas Controls</Type>
            <ControlRow>
                <Label htmlFor="orthographic" size="sm" align="right">
                    Orthographic
                </Label>
                <Checkbox
                    id="orthographic"
                    checked={orthographic}
                    onCheckedChange={() => {
                        set((s) => ({ orthographic: !s.orthographic }));
                    }}
                >
                    <CheckboxIndicator>
                        <CheckIcon />
                    </CheckboxIndicator>
                </Checkbox>
            </ControlRow>
            {/* <ControlRow>
                <Label htmlFor="zPos" size="sm" align="right">
                    Z Position
                </Label>
                <Input type="number" id="zPos" />
            </ControlRow> */}
        </Stack>
    );
}
