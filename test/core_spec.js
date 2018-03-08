import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, getWords} from '../src/core';

describe('Main logic', () => {
    describe('setEntries', () => {

        it('Adds the existing entries', () => {
            let state = Map([[
                'numbersMap', []
            ], [
                'inputValue', ''
            ], [
                'wordList', []
            ], [
                'historyList', []
            ]]);
            const entries = ['23', '453'];
            const nextState = setEntries(state, entries);
            let stateEntries = nextState.get('historyList');

            expect(stateEntries).to.deep.equal(entries);
        });
    });

    describe('getWords', () => {

        it('Constructs words based on digits input', () => {
            const mockedList = List(["wmt", "wmu", "wmv", "wnt", "wnu", "wnv", "wot", "wou", "wov", "xmt", "xmu", "xmv", "xnt", "xnu", "xnv", "xot", "xou", "xov", "ymt", "ymu", "ymv", "ynt", "ynu", "ynv", "yot", "you", "yov", "zmt", "zmu", "zmv", "znt", "znu", "znv", "zot", "zou", "zov"]);
            let input = '968';
            let numbersMap = Map([[
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
            let state = Map({
                'numbersMap': numbersMap,
                'inputValue': input,
                'wordList': [],
                'historyList': []
            });
            let nextState = getWords(state, input);
            let nextStateRealWords = getWords(state, input, true);

            expect(nextState.get('wordList')).to.deep.equal(mockedList);
            expect(nextStateRealWords.get('wordList')).to.deep.equal(List(['wot', 'you']));
        });
    });
});
