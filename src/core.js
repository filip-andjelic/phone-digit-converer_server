import {List, Map} from 'immutable';
import makeStore from './store';

const jsonfile = require('jsonfile');

/*
 * Iterator / Word constructor function.
 * It takes one digit's letter value {String}
 * and remaining digits {Array | String}.
 *
 * Doesn't return value, instead triggers callback.
 */
function wordConstructor(letter, digits, lastLetterCallback, word = '') {
    word += letter;

    if (!digits || !digits[0]) {
        lastLetterCallback(word);

        return;
    }

    let remainingDigits = digits.slice(1);
    const digitValues = numbersMap.get(digits[0]);

    digitValues.forEach(function(digitLetter) {
        wordConstructor(digitLetter, remainingDigits, lastLetterCallback, word);
    });
}

const numbersMap = Map([[
    '0', ['0']
], [
    '1', ['1']
], [
    '2', ['a', 'b', 'c']
], [
    '3', ['d', 'e', 'f']
], [
    '4', ['g', 'h', 'i']
], [
    '5', ['j', 'k', 'l']
], [
    '6', ['m', 'n', 'o']
], [
    '7', ['p', 'q', 'r', 's']
], [
    '8', ['t', 'u', 'v']
], [
    '9', ['w', 'x', 'y', 'z']
]]);

// Initial setting of history string items
export function setEntries(state, entries, callback) {
    let list = state.get('historyList').concat(entries);

    if (callback) {
        return callback(state.set('historyList', list));
    }

    return state.set('historyList', list);
}

// Toggling words' list filter
export function realWords(state, realWords, callback) {
    const existingInput = state.get('inputValue');

    return getWords(state, existingInput, realWords, callback);
}

// History list items getter
export function history(state) {
    return state.get('historyList');
}

/*
 *  Converter's main logic
 *
 *  @param input {String}
 *  @return callback
 */
export function getWords(state, input, filterWords, callback) {
    let wordList = new List();
    let checkWord = require('check-word');
    let isStringWord = checkWord('en');

    if (!input || typeof input !== 'string') {
        return wordList;
    }

    let digits = input.split('');

    if (!digits[0] || typeof digits[0] !== 'string') {
        return;
    }

    let remainingDigits = digits.slice(1);
    let digitValues = state.get('numbersMap').get(digits[0]);

    digitValues.forEach((letter) => {
        wordConstructor(letter, remainingDigits, function(word) {
            wordList = wordList.push(word);
        });
    });

    if (filterWords) {
        wordList = wordList.filter(function(someString) {
            if (isStringWord.check(someString)) {
                return someString;
            }
        });
    }

    let historyList = new List(jsonfile.readFileSync('./history.json').list).push(input);

    jsonfile.writeFileSync('./history.json', {
        list: historyList.toArray()
    });

    const nextState = state.set('inputValue', input)
        .set('filterWords', filterWords)
        .set('wordList', wordList)
        .set('historyList', historyList);

    if (callback) {
        return callback(nextState, wordList, filterWords);
    }

    return nextState;

}

export const INITIAL_STATE = Map([[
    'numbersMap', numbersMap
], [
    'inputValue', ''
], [
    'filterWords', false
], [
    'wordList', new List()
], [
    'historyList', new List()
]]);

export const store = makeStore();
