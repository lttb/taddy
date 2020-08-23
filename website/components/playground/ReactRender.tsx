import * as React from 'react';
import * as taddyCore from '@taddy/core';
import {css} from 'taddy';

import {useAtom} from '@reatom/react';

import {Column} from '../layout';
import {transformAtom} from './atoms';
import {Editor} from './Editor';
import {EditorLayer} from './EditorLayer';

import {transform, registerPreset, registerPlugin} from '@babel/standalone';

registerPreset('@babel/react', require('@babel/preset-react'));
registerPreset('@babel/typescript', require('@babel/preset-typescript'));
registerPlugin(
    '@babel/plugin-transform-modules-commonjs',
    require('@babel/plugin-transform-modules-commonjs'),
);

const Title = ({children}) => <h2>{children}</h2>;

const Wrapper = ({children}) => (
    <div
        {...css({
            overflow: 'hidden',
            position: 'relative',
            padding: '0 20px 20px',
            boxShadow: '0 0 13px -10px',
            borderRadius: '20px',
        })}
    >
        {children}
    </div>
);

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        //   logErrorToMyService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <p>Something went wrong.</p>;
        }

        return this.props.children;
    }
}

const react = require('react');
const deps = {
    react: {
        ...react,
        default: react,
    },
    taddy: require('taddy'),
    '@taddy/core': require('@taddy/core'),
};

export const ReactRender = ({code: sourceCode}) => {
    const [renderComponent, setRenderComponent] = React.useState(null);
    const [runtimeError, setRuntimeError] = React.useState(null);
    React.useEffect(() => {
        async function main() {
            try {
                setRuntimeError(null);

                if (!sourceCode) return;

                const {code} = await transform(sourceCode, {
                    root: __dirname,
                    filename: __filename,
                    presets: [
                        '@babel/react',
                        [
                            '@babel/typescript',
                            {allExtensions: true, isTSX: true},
                        ],
                    ],
                    plugins: [
                        [
                            '@babel/plugin-transform-modules-commonjs',
                            {noInterop: true, loose: true},
                        ],
                    ],
                });

                const fn = new Function('require', 'exports', code);
                const moduleExports = {};

                fn((name) => deps[name], moduleExports);

                if (React.isValidElement(moduleExports.default)) {
                    setRenderComponent(moduleExports.default);
                } else {
                    setRenderComponent(null);
                }
            } catch (e) {
                setRuntimeError(e);
            }
        }

        main();
    }, [sourceCode]);

    let layerProps: React.ComponentProps<typeof EditorLayer> = {};

    if (runtimeError) {
        layerProps = {variant: 'error', children: runtimeError.toString()};
    }

    const content = (
        <ErrorBoundary key={sourceCode + (runtimeError || '').toString()}>
            {renderComponent || <p>There is nothing to render</p>}
        </ErrorBoundary>
    );

    return (
        <>
            {content}

            <EditorLayer {...css({borderRadius: '20px'})} {...layerProps} />
        </>
    );
};
