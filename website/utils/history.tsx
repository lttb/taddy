import React from 'react';
import {createBrowserHistory, createMemoryHistory} from 'history';
import type {History, State, To} from 'history';
import qhistory from 'qhistory';
import {stringify, parse} from 'qs';

type QueryParams = object & {code: string};

type QueryOptions = {
    query: QueryParams;
};

type QTo = To & QueryOptions;

interface QHistory extends History {
    replace(to: QTo, state?: State): ReturnType<History['replace']>;
    location: History['location'] & QueryOptions;
}

const history = qhistory(
    typeof window === 'undefined'
        ? createMemoryHistory()
        : createBrowserHistory(),
    stringify,
    parse,
) as QHistory;

export const Location = ({children}) => {
    const [state, setState] = React.useState({history});

    history.listen(() => {
        setState({history});
    });

    return children(state.history);
};

export default history;
