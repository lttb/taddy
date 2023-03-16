import {css} from 'taddy';

export const SuperComponent = () => {
    return (
        <div {...css({color: 'purple', textDecoration: 'underline'})}>
            hello, super!!!
        </div>
    );
};
