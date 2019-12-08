const {Story} = require("../models");
const { users } = require("../server");

const redis = require('redis');
const bluebird = require("bluebird");

const client = redis.createClient(process.env.REDIS_URL || 6379);

bluebird.promisifyAll(redis.RedisClient.prototype);

bluebird.promisifyAll(redis.Multi.prototype);

 
client.on('error', (err) => {
    console.log("Error " + err);
});

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
        try {
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

module.exports = StoriesController;