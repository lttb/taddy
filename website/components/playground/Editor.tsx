import * as React from 'react';
import type {ComponentProps} from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';

export const Editor = (props: ComponentProps<typeof AceEditor>) => (
    <AceEditor
        mode="typescript"
        theme="textmate"
        showPrintMargin={false}
        maxLines={Infinity}
        width="100%"
        {...props}
    />
);
