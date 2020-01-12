const {Word, Story} = require("../models");

const writeWord = async (storyId, wordText, author, authorID) => {
    const story = await Story.findById(storyId);

    const word = new Word({
        authorID,
        word: wordText,
        author: author ? author : undefined,
        story: storyId,
    });

    await word.save();

    story.words.push(word._id);
    story.length += 1;

    await story.save();

    return word;
}

const getWords = async (storyId) => {
    const story = await Story.findById(storyId).populate('words', 'author word createdAt');
    if(!story) throw new Error("No stories found");
    return story.words;
}

module.exports = {
    writeWord,
    getWords
}