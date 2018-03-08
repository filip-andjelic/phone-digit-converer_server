import {setEntries, getWords, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_HISTORY':
            return setEntries(state, action.entries);
        case 'GET_WORDS':
            return getWords(state, action.input);
    }

    return state;
}
