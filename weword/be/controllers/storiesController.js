const {Story} = require("../models");
const { users } = require("../server");

const { isWordProfane } = require('../helpers/wordErrors');

const redis = require('redis');
const bluebird = require("bluebird");

const client = redis.createClient(process.env.REDIS_URL || 6379);

bluebird.promisifyAll(redis.RedisClient.prototype);

bluebird.promisifyAll(redis.Multi.prototype);


// const getPastProfanity = (word, room) => {
//     let result = [];
//     const pastWords = Story.findById(room).populate('words').slice('words', -10)
//     .select('words')
//     .lean()
//     .exec(function(err, group){
//         group.forEach(item => {
//             result.push(item.word);
//         });
//     });
//     console.log('past', result);
// }

 
client.on('error', (err) => {
    console.log("Error " + err);
});

const hasWordTooLong = (text, length) => {
    return text.split(" ").some(word => word.length > 15);
}

const StoriesController = {
    async index(req, res) {
        let users = {};
        try {
            let data = await client.getAsync('users');
            users = JSON.parse(data);
        } catch(e) {
            // if there's nothing in the cache, it's likely no one has been online recently
        }
        const stories = await Story.find().lean();

        // we need to make another inde
        for(let i = 0; i < stories.length; i++) {
            stories[i].onlineCount = (users && stories[i]._id in users) ? Object.values(users[stories[i]._id]).length : 0;
        }
        res.status(200).send({stories});
    },
    async show(req, res) {
        try {
            const story = await Story.findById(req.params.id).populate('words', 'author word createdAt');
            if(!story) throw "No stories found";
            res.status(200).send({story});
        } catch(error) {
            res.status(400).send(error);
        }
    },
    async create(req, res) {
        const testString = req.query.name.toLowerCase() + req.query.description.toLowerCase();
        const isProfane = isWordProfane(testString);

        try {
            if(req.query.name.length > 40 || req.query.description.length > 100
                || hasWordTooLong(req.query.name, 15) || hasWordTooLong(req.query.description, 20)) {
                console.log("Failed to make book from " + req.query.name + " and " + req.query.description);
                throw {message: "Story name or description too long"};
            }
            if(isProfane || !(/^[a-z\d\-_\s]+$/i.test(testString.toLowerCase()))) {
                console.log("Failed to make book from " + req.query.name + " and " + req.query.description);
                throw {message: "Story name and description must be alphanumeric and clean"};
            }

            const rules = JSON.parse(req.query.rules);
            rules.dictionary = true;
            rules.clean = true;

            rules.bannedWords = rules.bannedWords ? rules.bannedWords.split(/,| /).filter(word => word !== "") : [];
            rules.bannedWords = rules.bannedWords.map(word => word.toLowerCase());

            rules.bannedCharacters = rules.bannedCharacters ? rules.bannedCharacters.split(/,| /).filter(char => char !== "") : [];
            rules.bannedCharacters = rules.bannedCharacters.map(word => word.toLowerCase());

            const story = new Story({
                name: req.query.name,
                description: req.query.description,
                rules,
                customRules: req.query.customRules ? true : false,
                words: [],
            });
    
            await story.save();
            res.status(200).send({story});
        } catch(error) {
            res.status(400).send(error);
        }
    },
    async delete(req, res) {
        try {
            const story = await Story.findById(req.params.id);
            story.remove();
            res.status(200).send({story});
        } catch(error) {
            res.status(400).send({error});
        }
    },
    // TODO: add a clear function
}

module.exports = {StoriesController};