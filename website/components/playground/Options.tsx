import * as React from 'react';
import {css} from 'taddy';
import {useAtom, useAction} from '@reatom/react';

import {Column, Row} from '../layout';

import {playgroundAtom, updatePlayground} from './atoms';

export const Options = () => {
    const options = useAtom(playgroundAtom, (x) => x.options, ['options']);
    const handleOption = useAction((e) => {
        return updatePlayground({
            // @ts-expect-error
            options: {[e.target.name]: !!e.target.checked},
        });
    });

    const compileOptionsDisabled = !options.taddy;

    return (
        <Column gap={1} {...css({textAlign: 'left'})}>
            <label>
                <input
                    type="checkbox"
                    name="taddy"
                    checked={options.taddy}
                    onChange={handleOption}
                />
                use compiler
            </label>

            <Row inline gap={4} {...css({alignItems: 'center'})}>
                <h4 {...css(compileOptionsDisabled && {color: 'darkgray'})}>
                    Compile Options:
                </h4>

                <label>
                    <input
                        type="checkbox"
                        name="typescript"
                        disabled={compileOptionsDisabled}
                        checked={options.typescript}
                        onChange={handleOption}
                    />
                    typescript
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="evaluate"
                        disabled={compileOptionsDisabled}
                        checked={options.evaluate}
                        onChange={handleOption}
                    />
                    evaluate
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="unstable_CSSVariableFallback"
                        disabled={compileOptionsDisabled}
                        checked={options.unstable_CSSVariableFallback}
                        onChange={handleOption}
                    />
                    unstable_CSSVariableFallback
                </label>
            </Row>
        </Column>
    );
};
