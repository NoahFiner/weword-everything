const {Story} = require("../models/story.model");

var Filter = require('bad-words'),
    filter = new Filter();

filter.addWords("bullshit", "bullshitter", "bullshat", "shat", "shitter");

var checkWord = require('check-word'),
    words     = checkWord('en'); 
    

const baseErrorJSON = {
    minLength: 1,
    maxLength: 16,
    minWords: 1,
    maxWords: 1,
    bannedCharacters: [],
    bannedWords: [],
    clean: true,
    dictionary: true,
};

const getWordError = (word, errorJSON) => {
    if("minLength" in errorJSON && word.length < errorJSON.minLength) {
        return "word is shorter than minimum length of " + errorJSON.minLength;
    }
    if("maxLength" in errorJSON && word.length > errorJSON.maxLength) {
        return "word is longer than maximum length of " + errorJSON.maxLength;
    }
    if("minWords" in errorJSON && word.split(' ').length < errorJSON.minWords) {
        return "submission has less words than " + errorJSON.minWords;
    }
    if("maxWords" in errorJSON && word.split(' ').length > errorJSON.maxWords) {
        return "submission has more words than " + errorJSON.maxWords;
    }
    if("clean" in errorJSON && errorJSON.clean && filter.isProfane(word)) {
        return "let's keep it civil :)";
    }
    
    lowerCaseWord = word.toLowerCase();

    // we include some single-characer letters because those aren't approved by the dictionary without our manual help
    const punctuation = ['.', ',', '"', "'", '-', '!', '&', '(', ')', '=', '+', '/', '?', ':', ';', '~', 'i', 'o', 'u', 'a'];
    const isPunctuation = !punctuation.every(char => char !== lowerCaseWord);

    if(!(/^[a-zA-Z]+$/.test(lowerCaseWord)) && !isPunctuation && isNaN(lowerCaseWord)) {
        return "word can either be a word, number, or punctuation";
    }

    if("dictionary" in errorJSON && errorJSON.dictionary && !words.check(lowerCaseWord) && !isPunctuation && isNaN(lowerCaseWord)) {
        return "word must be in dictionary or be a number/punctuation";
    }


    if("bannedCharacters" in errorJSON && errorJSON.bannedCharacters.some(char => lowerCaseWord.includes(char.toLowerCase()))) {
        return "submission contains restricted character";
    }
    if("bannedWords" in errorJSON && errorJSON.bannedWords.some(bannedWord => lowerCaseWord.split(' ').some(compWord => compWord === bannedWord.toLowerCase()))) {
        return "submission contains restricted words";
    }
    return null;
};

module.exports = {
    baseErrorJSON,
    getWordError,
}