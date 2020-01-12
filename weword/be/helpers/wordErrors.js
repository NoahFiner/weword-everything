const {Story} = require("../models/story.model");

var Filter = require('bad-words'),
    filter = new Filter();

filter.addWords("bullshit", "bullshitter", "bullshat", "shat", "shitter");

const badStrings = ["nig", "niig", "niiig", "niiiig", "niiiiig", "niiiiiig", "niiiiiiig", "niiiiiiiiig", "fcuk", "fuk", "fuck", "siht", "shit", "cunt", "cnut", "kkk"];
filter.addWords(...badStrings);

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

const GLOBAL_CLEAN = true;
const GLOBAL_DICTIONARY = true;

const punctuationCount = word => {
    const punctuation = ['.', ',', '"', "'", '-', '!', '&', '(', ')', '=', '+', '/', '?', ':', ';', '~'];
    let count = 0;
    word.split('').forEach(char => {
        if (punctuation.some(punc => punc === char)) count++;
    });
    return count;
};

// remove any of the allowed punctuation
const clearPunctuation = word => {
    const punctuation = ['.', ',', '"', "'", '-', '!', '&', '(', ')', '=', '+', '/', '?', ':', ';', '~'];
    return word.split('').filter(char => {
        return punctuation.every(punc => punc !== char);
    }).join('');
}

const getWordError = (word, ruleJSON) => {
    // we include some single-characer letters because those aren't approved by the dictionary without our manual help
    const punctuation = ['.', ',', '"', "'", '-', '!', '&', '(', ')', '=', '+', '/', '?', ':', ';', '~'];
    const isPunctuation = word.split('').every(char => !punctuation.every(punc => punc !== char));

    if(isPunctuation && word.length <= ruleJSON.maxLength) return null;

    // if("minWords" in ruleJSON && word.split(' ').length < ruleJSON.minWords) {
    //     return "'" + word + "' has less words than " + ruleJSON.minWords;
    // }
    if((GLOBAL_CLEAN || ("clean" in ruleJSON && ruleJSON.clean)) && isWordProfane(word)) {
        return "let's keep it civil :)";
    }
    
    lowerCaseWord = clearPunctuation(word.toLowerCase());

    if(!(/^[a-zA-Z]+$/.test(lowerCaseWord)) && isNaN(lowerCaseWord)) {
        return "'" + word + "' must either be only a word, number, or have valid punctuation";
    }

    if((GLOBAL_DICTIONARY || ("dictionary" in ruleJSON && ruleJSON.dictionary)) && (!words.check(lowerCaseWord) && lowerCaseWord !== 'a' && lowerCaseWord !== 'i' && lowerCaseWord !== 'o')) {
        return "'" + word + "' isn't in the dictionary";
    }

    if("minLength" in ruleJSON && word.length < ruleJSON.minLength) {
        return "'" + word + "' is shorter than minimum length of " + ruleJSON.minLength;
    }
    if("maxLength" in ruleJSON && word.length > ruleJSON.maxLength) {
        return "'" + word + "' is longer than maximum length of " + ruleJSON.maxLength;
    }

    if("bannedCharacters" in ruleJSON && ruleJSON.bannedCharacters.some(char => lowerCaseWord.includes(char.toLowerCase()))) {
        for(let i = 0; i < ruleJSON.bannedCharacters.length; i++) {
            if(lowerCaseWord.includes(ruleJSON.bannedCharacters[i].toLowerCase())) return "'" + word + "' contains banned character '" + ruleJSON.bannedCharacters[i] + "'";
        }
    }
    if("bannedWords" in ruleJSON && ruleJSON.bannedWords.some(bannedWord => lowerCaseWord.split(' ').some(compWord => compWord === bannedWord.toLowerCase()))) {
        return "'" + word + "' is a banned word";
    }
    return null;
};

const isWordProfane = word => {
    return filter.isProfane(word) || badStrings.some(str => word.includes(str));
}

const validateRules = rules => {
    // min and max word length are required
    if(!rules.minLength || !rules.maxLength) {
        throw {message: "a min and max word length is required"};
    }

    // min and max word length must be in range
    // note that maxLength was originally 50 instead of 16, so we'll have an exception for og stories
    if(!(1 <= rules.minLength && rules.minLength <= rules.maxLength && (rules.maxLength <= 16 || rules.maxLength === 50))) {
        throw {message: "1 ≤ min word length ≤ max word length ≤ 16"};
    }

    // min and max sentence length are required
    if(!rules.minWords || !rules.maxWords) {
        throw {message: "a min and max sentence length is required"};
    }

    // min and max sentence length must be in range
    if(!(1 <= rules.minWords && rules.minWords <= rules.maxWords && rules.maxWords <= 16)) {
        throw {message: "1 ≤ min sentence length ≤ max sentence length ≤ 16"};
    }

    // split the banned characters string by commas and spaces
    if(rules.bannedCharacters.length > 0) {
        // all banned characters must be alphanumeric and one character long
        if(!rules.bannedCharacters.every(word => word.length === 1 && (/^[0-9a-z]+$/).test(word))) {
            throw {message: "all banned characters must be alphanumeric and one character long"};
        }

        // no duplicates
        if(rules.bannedCharacters.length !== new Set(rules.bannedCharacters).size) {
            throw {message: "don't ban the same character twice"};
        }

        // someone could do something like banning f,u,c,k
        if(isWordProfane(rules.bannedCharacters.join(""))) {
            throw {message: "don't try to get around the filter"};
        }
    }

    // split the banned words string by commas and spaces
    if(rules.bannedWords.length > 0) {
        // no duplicates
        if(rules.bannedWords.length !== new Set(rules.bannedWords).size) {
            throw {message: "don't ban the same word twice"};
        }

        // someone could do something like banning fu,ck
        if(isWordProfane(rules.bannedWords.join(""))) {
            throw {message: "don't try to get around the filter"};
        }

        // all banned words must fit the general word rules
        newRules = {...rules, minWords: 1, bannedCharacters: [], bannedWords: []};

        for(let i = 0; i < rules.bannedWords.length; i++) {
            const wordError = getWordError(rules.bannedWords[i], newRules);
            if(wordError) throw {message: "the word '" + rules.bannedWords[i] + "' isn't a valid word. '" + wordError + "'"};
        }
    }

    return true;
 }

module.exports = {
    baseErrorJSON,
    isWordProfane,
    validateRules,
    getWordError,
}