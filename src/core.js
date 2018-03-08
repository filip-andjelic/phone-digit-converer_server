import {List, Map} from 'immutable';
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

export const INITIAL_STATE = Map([[
    'numbersMap', numbersMap
], [
    'inputValue', ''
], [
    'wordList', new List()
], [
    'historyList', []
]]);

export function setEntries(state, entries) {
    let list = state.get('historyList').concat(entries);

    // @TODO edit history.json file with new entries.

    return state.set('historyList', list);
}

export function getEntries(state) {
    return state.get('historyList');
}
/*
 *  Converter's main logic
 *
 *  @param input {String}
 *  @return wordList {Array | String}
 */
export function getWords(state, input, filterWords) {
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

    // @TODO edit words.json with new words

    return state.set('wordList', wordList);
}

