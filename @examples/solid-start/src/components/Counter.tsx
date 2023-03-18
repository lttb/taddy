import {createSignal} from 'solid-js';
import {css} from 'taddy';

export default function Counter() {
    const [count, setCount] = createSignal(0);
    return (
        <button {...css({color: 'red'})} onClick={() => setCount(count() + 1)}>
            Clicks: {count()}
        </button>
    );
}
