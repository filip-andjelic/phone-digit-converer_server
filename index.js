import {startServer} from './src/server';
import {store} from './src/core';

const jsonfile = require ('jsonfile');

startServer(store);

store.dispatch({
    type: 'SET_HISTORY',
    entries: jsonfile.readFileSync('./history.json').list
});
