const {Word} = require("../models");
const {writeWord} = require("../helpers/wordHelpers");

const WordController = {
    async show(req, res) {
        try {
            const word = await Word.find(req.params.wordId);
            res.status(200).send({word});
        } catch(error) {
            res.status(400).send({error});
        }
    },
    async write(req, res) {
        try {
            const result = await writeWord(req.params.storyId, req.query.word);
            res.status(200).send({result});
        } catch(error) {
            res.status(400).send({error});
        }
    },
};

module.exports = WordController;