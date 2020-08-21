import * as React from 'react';
import {css} from 'taddy';
import {useAtom, useAction} from '@reatom/react';

import {row, column, Row} from '../layout';

import {playgroundAtom, updatePlayground} from './atoms';

export const Options = () => {
    const options = useAtom(playgroundAtom, (x) => x.options, ['options']);
    const handleOption = useAction((e) => {
        return updatePlayground({
            // @ts-expect-error
            options: {[e.target.name]: !!e.target.checked},
        });
    });

    return (
        <div {...css({textAlign: 'left'})}>
            <Row {...css(row({gap: 4, inline: true}), {alignItems: 'center'})}>
                <h4>Compile Options:</h4>

                <label>
                    <input
                        type="checkbox"
                        name="typescript"
                        checked={options.typescript}
                        onChange={handleOption}
                    />
                    typescript
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="evaluate"
                        checked={options.evaluate}
                        onChange={handleOption}
                    />
                    evaluate
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
        </div>
    );
};
