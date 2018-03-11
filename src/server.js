import Server from 'socket.io';
import {history} from './core.js'

export function startServer(store) {
    const io = new Server().attach(7171);
    let currentState = store.getState();

    io.on('connection', (socket) => {
        socket.on('INPUT_CHANGE', (input, filterWords) => {
            store.dispatch({
                type: 'GET_WORDS',
                input: input,
                state: currentState,
                filterWords: filterWords,
                callback: (newState, wordList) => {
                    currentState = newState;

                    socket.emit('WORD_LIST', wordList);
                }
            });
        });

        socket.on('TOGGLE_REAL_WORDS', (realWords) => {
            store.dispatch({
                type: 'TOGGLE_REAL_WORDS',
                realWords: realWords,
                state: currentState,
                callback: (newState, isFiltered) => {
                    currentState = newState;

                    socket.emit('REAL_WORDS_EDIT', isFiltered);
                }
            });
        });

        socket.on('TOGGLE_HISTORY_LIST', () => {
            console.log('SERVER');
            console.log(history(currentState));
            socket.emit('HISTORY_LIST_UPDATE', history(currentState));
        });
    });

}
