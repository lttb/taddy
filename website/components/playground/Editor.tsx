import dynamic from 'next/dynamic';

import * as React from 'react';
import type {ComponentProps} from 'react';

// @see https://github.com/securingsincity/react-ace/issues/725
const AceEditor = dynamic(
    async () => {
        const reactAce = await import('react-ace');

        await Promise.all([
            // prevent warning in console about misspelled props name.
            import('ace-builds/src-min-noconflict/ext-language_tools'),
            import('ace-builds/src-min-noconflict/ext-beautify'),

            import('ace-builds/src-min-noconflict/mode-typescript'),
            import('ace-builds/src-min-noconflict/mode-tsx'),
            import('ace-builds/src-min-noconflict/mode-css'),

            import('ace-builds/src-min-noconflict/theme-textmate'),
        ]);

        // await import('ace-builds/src-min-noconflict/ext-language_tools');
        // await import('ace-builds/src-min-noconflict/ext-beautify');

        // // import your theme/mode here. <AceEditor mode="javascript" theme="solarized_dark" />
        // await import('ace-builds/src-min-noconflict/mode-typescript');
        // await import('ace-builds/src-min-noconflict/mode-css');
        // await import('ace-builds/src-min-noconflict/theme-textmate');

        // as @Holgrabus commented you can paste these file into your /public folder.
        // You will have to set basePath and setModuleUrl accordingly.
        let ace = require('ace-builds/src-min-noconflict/ace');
        ace.config.set(
            'basePath',
            'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/',
        );
        ace.config.setModuleUrl(
            'ace/mode/javascript_worker',
            'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js',
        );

        return reactAce;
    },
    {
        ssr: false, // react-ace doesn't support server side rendering as it uses the window object.
        loading: () => <p>Loading...</p>,
    },
);

export const Editor = (props: ComponentProps<typeof AceEditor>) => (
    <AceEditor
        mode="tsx"
        theme="textmate"
        showPrintMargin={false}
        maxLines={Infinity}
        width="100%"
        {...props}
        style={{
            ...props.style,
            minWidth: 350,
        }}
    />
);
