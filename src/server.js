import Server from 'socket.io';
import {getWords} from './core';

export function startServer(store) {
    const io = new Server().attach(7171);

    store.subscribe(
        () => io.emit('state', store.getState().toJS())
    );

    io.on('connection', (socket) => {
        console.log('A user connected!');

        socket.emit('state', store.getState().toJS());

        socket.on('action', store.dispatch.bind(store));
        socket.on('inputChange', (input, filterWords) => {
            let wordList = getWords(input, filterWords);

            io.emit('wordList', wordList);
        });
    });

}
