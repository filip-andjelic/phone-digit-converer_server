import Server from 'socket.io';

export function startServer(store) {
    const jsonfile = require ('jsonfile');
    const io = new Server().attach(7171);
    let currentState = store.getState();

    // Read initial history list from server
    store.dispatch({
        type: 'SET_HISTORY',
        entries: jsonfile.readFileSync('./history.json').list,
        state: currentState,
        callback: (newState) => {
            currentState = newState;
        }
    });

    io.on('connection', (socket) => {
        // When user connects load input value from server Store
        socket.emit('INPUT_UPDATE', currentState.get('inputValue'));

        // Listener for handling user input, and serving words' list
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

        // Listener for toggling filter on words' list
        socket.on('TOGGLE_REAL_WORDS', (realWords) => {
            store.dispatch({
                type: 'TOGGLE_REAL_WORDS',
                realWords: realWords,
                state: currentState,
                callback: (newState, wordList, isFiltered) => {
                    currentState = newState;

                    socket.emit('WORD_LIST', wordList);
                    socket.emit('REAL_WORDS_EDIT', isFiltered);
                }
            });
        });

        socket.on('TOGGLE_HISTORY_LIST', () => {
            socket.emit('HISTORY_LIST_NEW', currentState.get('historyList'));
        });
    });

}
