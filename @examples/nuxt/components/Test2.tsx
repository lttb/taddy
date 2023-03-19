import {css} from 'taddy';

export default defineComponent({
    render: () => {
        return (
            <div {...css({color: 'purple', textDecoration: 'underline'})}>
                Hello World 2
            </div>
        );
    },
});
