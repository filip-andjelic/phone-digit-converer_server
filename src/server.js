import Server from 'socket.io';

export function startServer(store) {
    const jsonfile = require ('jsonfile');
    const io = new Server().attach(7171);
    let currentState = store.getState();

    store.dispatch({
        type: 'SET_HISTORY',
        entries: jsonfile.readFileSync('./history.json').list,
        state: currentState,
        callback: (newState) => {
            currentState = newState;
        }
    });

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
            socket.emit('HISTORY_LIST_NEW', currentState.get('historyList'));
        });
    });

}
