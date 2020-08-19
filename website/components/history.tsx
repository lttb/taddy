import React from 'react';
import {createBrowserHistory, createMemoryHistory} from 'history';
import qhistory from 'qhistory';
import {stringify, parse} from 'qs';

const history = qhistory(
    typeof window === 'undefined'
        ? createMemoryHistory()
        : createBrowserHistory(),
    stringify,
    parse,
);

export const Location = ({children}) => {
    const [state, setState] = React.useState({history});

    history.listen(() => {
        setState({history});
    });

    return children(state.history);
};

export default history;
