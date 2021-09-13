import React from 'react';
import { Type } from '@/components/Type';
import { styled } from '@/stitches.config';
import { Input } from '@/components/Input';
import { useResolutionStore } from './store';

const Stack = styled('div', {
    display: 'grid',
    gap: '$2',
});

const ControlsRow = styled('div', {
    display: 'grid',
    gridTemplateColumns: '2fr 3fr',
    gap: '$1',
    alignItems: 'center',
});

const Flex = styled('div', {
    display: 'flex',
    '& > * + *': {
        marginLeft: '$1',
    },
});

export function ResolutionControls() {
    const { height, width, mode, ratio } = useResolutionStore();

    return (
        <Stack>
            <Type>Sketch Size</Type>
            <ControlsRow>
                <Type size="xs" align="right">
                    Mode:
                </Type>
                <Input
                    as="select"
                    size="sm"
                    width="twoThirds"
                    value={mode}
                    onChange={(e: any) => {
                        // @ts-ignore: Cant be bothered typing this
                        useResolutionStore.setState({ mode: e.target.value });
                    }}
                >
                    <Type as="option" size="xs" value="screen">
                        Screen
                    </Type>
                    <Type as="option" size="xs" value="aspect-ratio">
                        Aspect Ratio
                    </Type>
                    <Type as="option" size="xs" value="set">
                        Set Dimensions
                    </Type>
                </Input>
            </ControlsRow>
            {mode === 'aspect-ratio' && (
                <ControlsRow>
                    <Type size="xs" align="right">
                        Ratio:
                    </Type>
                    <Input
                        type="number"
                        size="sm"
                        width="third"
                        value={ratio || ''}
                        onChange={(e) => {
                            useResolutionStore.setState({
                                ratio: +e.target.value,
                            });
                        }}
                    />
                </ControlsRow>
            )}
            {mode === 'set' && (
                <ControlsRow>
                    <Type size="xs" align="right">
                        W x H:
                    </Type>
                    <Flex>
                        <Input
                            type="number"
                            size="sm"
                            width="third"
                            value={width || ''}
                            onChange={(e) => {
                                useResolutionStore.setState({
                                    width: +e.target.value,
                                });
                            }}
                        />
                        <Input
                            type="number"
                            size="sm"
                            width="third"
                            value={height || ''}
                            onChange={(e) => {
                                useResolutionStore.setState({
                                    height: +e.target.value,
                                });
                            }}
                        />
                    </Flex>
                </ControlsRow>
            )}
        </Stack>
    );
}
