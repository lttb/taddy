import {css} from 'taddy';

export default defineComponent({
    render: () => {
        return (
            <div {...css({color: 'red', textDecoration: 'underline'})}>
                Hello World
            </div>
        );
    },
});
