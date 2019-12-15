const {Story} = require("../models");
const { users } = require("../server");

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


var Filter = require('bad-words'),
    filter = new Filter();

 
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
        res.send({stories}).status(200);
    },
    async show(req, res) {
        try {
            const story = await Story.findById(req.params.id).populate('words');
            if(!story) throw new Error("No stories found");
            res.send({story}).status(200);
        } catch(error) {
            res.send({error}).status(400);
        }
    },
    async create(req, res) {
        const badStrings = ["nig", "niig", "niiig", "niiiig", "niiiiig", "niiiiiig", "niiiiiiig", "niiiiiiiiig", "fcuk", "fuk", "fuck", "siht", "shit", "cunt", "cnut", "kkk"];

        const testString = req.query.name.toLowerCase() + req.query.description.toLowerCase();
        const isProfane = filter.isProfane(testString) || badStrings.some(str => testString.includes(str));
        try {
            if(req.query.name.length > 40 || req.query.description.length > 100
                || hasWordTooLong(req.query.name, 15) || hasWordTooLong(req.query.description, 20)) {
                console.log("Failed to make book from " + req.query.name + " and " + req.query.description);
                throw new Error("story too long");
            }
            if(isProfane || !(/^[a-z\d\-_\s]+$/i.test(testString.toLowerCase()))) {
                console.log("Failed to make book from " + req.query.name + " and " + req.query.description);
                throw new Error("unknown error");
            }
            const story = new Story({
                name: req.query.name,
                description: req.query.description,
                words: [],
            });
    
            await story.save();
            res.send({story}).status(200);
        } catch(error) {
            res.send({error}).status(400);
        }
    },
    async delete(req, res) {
        try {
            const story = await Story.findById(req.params.id);
            story.remove();
            res.send({story}).status(200);
        } catch(error) {
            res.send({error}).status(400);
        }
    },
    // TODO: add a clear function
}

module.exports = {StoriesController};