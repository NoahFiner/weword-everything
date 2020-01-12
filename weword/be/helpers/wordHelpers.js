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
    const story = await Story.findById(storyId).populate('words', {
        author: 1,
        word: 1,
        _id: 0,
        authorID: 0,
        createdAt: 1,
    });
    if(!story) throw new Error("No stories found");
    return story.words;
}

module.exports = {
    writeWord,
    getWords
}