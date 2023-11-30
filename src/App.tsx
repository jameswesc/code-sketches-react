import React from 'react';
import { Route } from 'wouter';

import { SketchLayout } from '@/components/SketchLayout';
import { Sketch as Sketch210917 } from '@/sketches/210917';
import { Sketch as Sketch210918 } from '@/sketches/210918';
import { Sketch as Sketch210919 } from '@/sketches/210919';
import { Sketch as Sketch210920 } from '@/sketches/210920';
import { Sketch as Sketch210921 } from '@/sketches/210921';
import { Sketch as Sketch210925 } from '@/sketches/210925';
import { Sketch as Sketch210926 } from '@/sketches/210926';
import { Sketch as Sketch210927 } from '@/sketches/210927';
import { Sketch as Sketch210928 } from '@/sketches/210928';
import { Sketch as Sketch210929 } from '@/sketches/210929';

function App(): JSX.Element {
    return (
        <SketchLayout
            sketch={
                <>
                    <Route path="/210917" component={Sketch210917} />
                    <Route path="/210918" component={Sketch210918} />
                    <Route path="/210919" component={Sketch210919} />
                    <Route path="/210920" component={Sketch210920} />
                    <Route path="/210921" component={Sketch210921} />
                    <Route path="/210925" component={Sketch210925} />
                    <Route path="/210926" component={Sketch210926} />
                    <Route path="/210927" component={Sketch210927} />
                    <Route path="/210928" component={Sketch210928} />
                    <Route path="/210929" component={Sketch210929} />

                    <Route path="/">
                        <div style={{ padding: 80 }}>
                            <ul>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210917"
                                    >
                                        Sketch 17/09/21
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210918"
                                    >
                                        Sketch 18/09/21
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210919"
                                    >
                                        Sketch 19/09/21
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210920"
                                    >
                                        Sketch 20/09/21
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210921"
                                    >
                                        Sketch 21/09/21
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210925"
                                    >
                                        Sketch 25/09/21
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210926"
                                    >
                                        Sketch 26/09/21
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210927"
                                    >
                                        Sketch 27/09/21
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210928"
                                    >
                                        Sketch 28/09/21
                                    </a>
                                </li>
                                <li>
                                    <a
                                        style={{ textDecoration: 'underline' }}
                                        href="/210929"
                                    >
                                        Sketch 29/09/21
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
