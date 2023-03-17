<script>
import {css} from 'taddy';

export default {
    data: () => ({
        h1: css({color: 'red'}),
    }),
};
</script>

<template>
    <h1 v-bind="h1">Hello world!</h1>
</template>
