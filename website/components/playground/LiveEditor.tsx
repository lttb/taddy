import * as React from 'react';
import {useAction, useAtom} from '@reatom/react';

import {css, $} from 'taddy';

import {useCode} from '../../utils/code';
import {playgroundAtom, updatePlayground} from './atoms';
import {Editor} from './Editor';

export const LiveEditor = () => {
    useCode();

    const code = useAtom(playgroundAtom, (x) => x.code, ['code']);
    const handleCode = useAction((code) => updatePlayground({code}));

    React.useEffect(() => {
        setTimeout(() => {
            handleCode(code);
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
                    minHeight: '300px',

                    ' .ace_gutter': {
                        background: 'none',
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
