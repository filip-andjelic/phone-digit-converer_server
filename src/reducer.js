import {setEntries, getWords, realWords, history, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_HISTORY':
            return setEntries(action.state, action.entries, action.callback);
        case 'GET_WORDS':
            return getWords(action.state, action.input, action.filterWords, action.callback);
        case 'TOGGLE_REAL_WORDS':
            return realWords(action.state, action.realWords, action.callback);
        case 'TOGGLE_HISTORY_LIST':
            return history(action.state, action.callback);
    }

    return state;
}
