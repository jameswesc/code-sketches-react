import React from 'react';
import { Route } from 'wouter';

import { SketchLayout } from '@/components/SketchLayout';
import { Sketch as Sketch220917 } from '@/sketches/220917';
import { Sketch as Sketch220918 } from '@/sketches/220918';
import { Sketch as Sketch220919 } from '@/sketches/220919';
import { Sketch as Sketch220920 } from '@/sketches/220920';
import { Sketch as Sketch220921 } from '@/sketches/220921';
import { Sketch as Sketch220925 } from '@/sketches/220925';
import { Sketch as Sketch220926 } from '@/sketches/220926';
import { Sketch as Sketch220927 } from '@/sketches/220927';
import { Sketch as Sketch220928 } from '@/sketches/220928';
import { Sketch as Sketch220929 } from '@/sketches/220929';

function App(): JSX.Element {
    return (
        <SketchLayout
            sketch={
                <>
                    <Route path="/220917" component={Sketch220917} />
                    <Route path="/220918" component={Sketch220918} />
                    <Route path="/220919" component={Sketch220919} />
                    <Route path="/220920" component={Sketch220920} />
                    <Route path="/220921" component={Sketch220921} />
                    <Route path="/220925" component={Sketch220925} />
                    <Route path="/220926" component={Sketch220926} />
                    <Route path="/220927" component={Sketch220927} />
                    <Route path="/220928" component={Sketch220928} />
                    <Route path="/220929" component={Sketch220929} />

                    <Route path="/">
                        <div style={{ padding: 80 }}>
                            <ul>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220917"
                                    >
                                        Sketch 17/09/22
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220918"
                                    >
                                        Sketch 18/09/22
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220919"
                                    >
                                        Sketch 19/09/22
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220920"
                                    >
                                        Sketch 20/09/22
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220921"
                                    >
                                        Sketch 21/09/22
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220925"
                                    >
                                        Sketch 25/09/22
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220926"
                                    >
                                        Sketch 26/09/22
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220927"
                                    >
                                        Sketch 27/09/22
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220928"
                                    >
                                        Sketch 28/09/22
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/220929"
                                    >
                                        Sketch 29/09/22
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </Route>
                </>
            }
        />
    );
}

export default App;
