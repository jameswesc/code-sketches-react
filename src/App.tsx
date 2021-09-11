import React from 'react';

import Layout from '@/features/sketchLayout';
import { Sketch, Controls } from '@/sketches/physicalMaterials';

function App(): JSX.Element {
    return <Layout sketch={<Sketch />} controls={<Controls />} />;
}

export default App;
