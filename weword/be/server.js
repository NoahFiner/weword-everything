const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const redis = require('redis');

// create and connect redis client to local instance.
const client = redis.createClient(process.env.REDIS_URL || 6379);
 
// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err);
});


const bodyParser = require('body-parser');
const cors = require('cors');

const axios = require('axios');

const port = process.env.PORT || 4001;
const index = require('./routes/index');

const storyRouter = require('./routes/stories');
const wordRouter = require('./routes/words');

const {Story} = require('./models');

const {getWordError} = require('./helpers/wordErrors');

const app = express();
app.use(cors());
app.use(index);
app.use(storyRouter);
app.use(wordRouter);
app.use(bodyParser.json());

const mongoPath = process.env.MONGO_URL || '127.0.0.1:27017';

console.log("MONGO_URL ENV VARIABLE", process.env.MONGO_URL);
console.log("mongoPath is now", mongoPath);

mongoose.connect('mongodb://'+ mongoPath +'/stories', { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

app.use(express.static(__dirname + '/public'));

const server = http.createServer(app);

const io = socketIo(server);

server.listen(port, () => console.log('listening on port', port));

// in the format of room ids to arrays of words
let words = {};

let timeout = {};

// in the form of room ids to maps of socket ids to usernames
let users = {};
// in the form of socket ids to rooms
let socketIdsToRooms = {};

const {writeWord, getWords} = require("./helpers/wordHelpers");

io.on("connection", socket => {
    console.log("new user connected");

    socket.on('join', async ({room, username}, callback) => {
      try {

        if(username.length > 16) {
          callback("Username " + username + " too long :(");
          return;
        }

        console.log(username + " is joining " + room);
        socket.join(room);

        // if the room doesn't exist yet
        if(!(room in users)) {
          users[room] = {};
        }
        if(!username) {
          users[room][socket.id] = "Guest";
        } else {
          if(Object.values(users[room]).some(name => name === username)) {
            // TODO: test this
            callback("Someone named " + username + " is already writing in this story");
            return;
          } else {
            users[room][socket.id] = username;
          }
        }

        socketIdsToRooms[socket.id] = room;

        // if the words for this story haven't been loaded yet
        if(!(room in words)) {
          try {
            words[room] = await getWords(room);
          } catch(error) {
            socket.emit("sendWords", []);
          }
        }

        client.setex('users', 999999, JSON.stringify(users));
        io.to(room).emit("sendUsers", Object.values(users[room]));
        socket.emit("sendWords", words[room]);
      } catch(error) {
        callback(error);
      }
    });

    socket.on("addWord", async ({word, room}, callback) => {
      // get rules
      const story = await Story.findById(room);
      if(!story) {
        callback("invalid story");
        return;
      };

      let error;
      if(story.rules.maxWords > 1) {
        let words = word.split(' ');
        if(words.length > story.rules.maxWords || words.length < story.rules.minWords) {
          error = story.rules.minWords === story.rules.maxWords
            ? "you must submit " + story.rules.minWords + " words at a time but you submitted " + words.length
            : "you must submit between " + story.rules.minWords + " and " + story.rules.maxWords + " words, but you submitted " + words.length;
        } else {
          for(let i = 0; i < words.length; i++) {
            error = getWordError(words[i], story.rules);
            if(error) {
              // error = "Issue with word '" + words[i] + "': " + error;
              break;
            };
          }
        }
      } else {
        if(word.split(' ').length !== 1) {
          error = "you can only submit one word at a time";
        } else {
          error = getWordError(word, story.rules);
        }
      }
      if(error) {
        callback(error);
      } else {
        if(!timeout[room]) {
          try {
            if (!([socket.id] in users[room])) {
              callback("you're not logged into this book, try refreshing the page");
              return;
            }
            const username = users[room][socket.id];
            words[room].push({word, author: username});

            callback();

            io.to(room).emit("sendWords", words[room]);
            io.to(room).emit("disable");

            // TODO: error checking

            // TODO: make this promise based also or something
            timeout[room] = setTimeout(async () => {
              // Room's id is going to be the storyId too
              writtenWord = await writeWord(room, word, username);
              words[room] = await getWords(room);
              //TODO: make the timeout longer for the person that submitted the word
              io.to(room).emit("enable");
              timeout[room] = null;
            }, 750);
          } catch(error) {
            callback(error);
          }
        } else {
          callback("word submitted too fast!");
        }
      }
    });

    socket.on("disconnect", () => {
      // we need to find the room that this user was logged into which is kind of a pain
      let room = socketIdsToRooms[socket.id];

      console.log(socket.id + " is leaving " + room);

      if(!room) return;
      delete users[room][socket.id];
      if(Object.values(users[room]).length === 0) {
        delete words[room];
        delete users[room];
        delete socketIdsToRooms[socket.id];
        io.to(room).emit("sendUsers", []);
      } else {
        io.to(room).emit("sendUsers", Object.values(users[room]));
      }
      client.setex('users', 999999, JSON.stringify(users));
    });
});

// module.exports = { users }