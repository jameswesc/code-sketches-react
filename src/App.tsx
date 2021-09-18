import React from 'react';

import { SketchLayout } from '@/components/SketchLayout';
import { Sketch } from '@/sketches/cs13';

function App(): JSX.Element {
    return <SketchLayout sketch={<Sketch />} />;
}

export default App;
