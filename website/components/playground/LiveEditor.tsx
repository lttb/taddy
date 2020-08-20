import * as React from 'react';
import {useAction, useAtom} from '@reatom/react';

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
            <h2>Source Code</h2>

            <Editor
                debounceChangePeriod={50}
                value={code}
                onChange={handleCode}
                name="TADDY_EDITOR"
                editorProps={{$blockScrolling: true}}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                }}
            />
        </div>
    );
};
