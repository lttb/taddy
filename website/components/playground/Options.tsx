import * as React from 'react';
import {css} from 'taddy';
import {useAtom, useAction} from '@reatom/react';

import {playgroundAtom, updatePlayground} from './atoms';

import {row, Row} from '../layout';

export const Options = () => {
    const options = useAtom(playgroundAtom, (x) => x.options, ['options']);
    const handleOption = useAction((e) => {
        return updatePlayground({
            // @ts-expect-error
            options: {[e.target.name]: !!e.target.checked},
        });
    });

    return (
        <Row {...css(row({gap: 4, inline: true}))}>
            <label>
                <input
                    type="checkbox"
                    name="typescript"
                    checked={options.typescript}
                    onChange={handleOption}
                />
                Typescript
            </label>

            <label>
                <input
                    type="checkbox"
                    name="evaluate"
                    checked={options.evaluate}
                    onChange={handleOption}
                />
                Evaluate
            </label>

            <label>
                <input
                    type="checkbox"
                    name="unstable_CSSVariableFallback"
                    checked={options.unstable_CSSVariableFallback}
                    onChange={handleOption}
                />
                unstable_CSSVariableFallback
            </label>
        </Row>
    );
};
