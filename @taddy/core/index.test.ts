import {expect, describe, it} from '@jest/globals';

import {config, css} from '.';

const getClassName = (key, value) =>
    config.nameGenerator.getName(key, value).join('');

describe('@taddy/core', () => {
    it('should merge styles', () => {
        const elem = css(
            `${getClassName('color', 'red')} ${getClassName(
                'background',
                'blue',
            )}`,
            '__id1',
        );

        expect(
            css(
                {
                    ...elem,
                    [getClassName('color', 'blue')]: true,
                },
                '__id2',
            ).className,
        ).toEqual(
            `${getClassName('color', 'blue')} ${getClassName(
                'background',
                'blue',
            )} __id1 __id2`,
        );

        expect(
            css(
                {
                    [getClassName('color', 'blue')]: true,
                    ...elem,
                },
                '__id2',
            ).className,
        ).toEqual(
            `${getClassName('color', 'red')} ${getClassName(
                'background',
                'blue',
            )} __id1 __id2`,
        );
    });
});
