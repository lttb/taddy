import * as React from 'react';
import {css} from 'taddy';

function bind<
    T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
    P extends T extends keyof JSX.IntrinsicElements
        ? JSX.IntrinsicElements[T]
        : React.ComponentProps<T>,
    S
>(
    Comp: T,
    styles: S,
): (
    props: S extends (...args: any) => any ? Parameters<S>[0] : P,
) => JSX.Element;

function bind(Comp, styles) {
    const fn =
        typeof styles === 'function'
            ? styles
            : ({className, style, ...props}) => ({
                  ...props,
                  ...css(styles, {className, style}),
              });
    return (props) => {
        const newProps = fn(props);

        if (typeof Comp === 'string') {
            return React.createElement(Comp, newProps);
        }

        return Comp(newProps);
    };
}

const MyButtonBase = bind('button', css({color: 'yellow'}));
const MyButton = bind(MyButtonBase, css({padding: '10px'}));

const Button = ({
    style,
    className,
    ...props
}: JSX.IntrinsicElements['button']) => {
    return (
        <button
            {...props}
            {...css({
                color: 'red',
                padding: '10px',
                border: 'none',
                style,
                className,
            })}
        />
    );
};

const StyledButton = bind(Button, css({fontSize: '20px'}));

const VariantButton = bind(
    StyledButton,
    ({
        variant = 'action',
        ...props
    }: {variant: 'normal' | 'action'} & React.ComponentProps<
        typeof StyledButton
    >) => ({
        ...props,
        ...css({color: 'violet'}),
    }),
);

const second = css({color: 'orange'});
const first = css({color: 'green', [` + ${second}`]: {color: 'purple'}});

export default function Test({c = Math.random()}) {
    let color = 'blue';

    return (
        <div>
            <div {...second}>second</div>
            <div {...first}>first</div>
            <div {...second}>second next</div>

            <Button>hello</Button>

            <MyButton {...css({background: 'pink'})}>hello my friend</MyButton>

            <Button {...css({color: 'blue', background: 'green'})}>
                hello
            </Button>

            <StyledButton type="button">hello last</StyledButton>

            <VariantButton variant="normal">variant button</VariantButton>

            <StyledButton type="button" {...css({color})}>
                hello last
            </StyledButton>
        </div>
    );
}
