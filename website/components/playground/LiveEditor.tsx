import * as React from 'react';
import {useAction, useAtom} from '@reatom/react';

import {css, $} from 'taddy';

import {stripIndent} from 'common-tags';

import {useCode} from '../../utils/code';
import {playgroundAtom, updatePlayground} from './atoms';
import {Editor} from './Editor';

export const LiveEditor = ({
    initialCode,
    persistent,
}: {
    initialCode?: string;
    persistent?: boolean;
}) => {
    const code = useAtom(playgroundAtom, (x) => x.code, ['code']);
    const storageCode = useCode(persistent ? code : null);

    const handleCode = useAction((code) => {
        return updatePlayground({code});
    });

    React.useEffect(() => {
        setTimeout(() => {
            handleCode(storageCode || stripIndent(initialCode) + '\n');
        }, 0);
    }, []);

    return (
        <div>
            <h2>Code</h2>

            <Editor
                debounceChangePeriod={50}
                value={code}
                onChange={handleCode}
                name="TADDY_EDITOR"
                editorProps={{$blockScrolling: true}}
                focus={true}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                }}
                {...css({
                    ' .ace_gutter': {
                        background: 'transparent',
                    },

                    ' .ace_gutter-cell': {
                        paddingLeft: 0,
                        // paddingRight: 0,
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                    },

                    ' .ace_fold-widget': {
                        // width: '100%',
                        // marginLeft: '5px',
                        // paddingRight: '10px',
                        // backgroundPosition: '5px',
                    },
                })}
            />
        </div>
    );
};
