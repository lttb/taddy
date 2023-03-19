import {config} from 'taddy';

config({
    unstable_mapStyles: (result) => ({
        class: result.className,
        style: result.style,
    }),
});
