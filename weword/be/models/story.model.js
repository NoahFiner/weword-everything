const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {baseErrorJSON, validateRules} = require('../helpers/wordErrors');

const storyModel = new Schema({
    // rules: {
    //     type: Object
    // },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    length: {
        type: Number,
        default: 0,
    },
    customRules: {
        type: Boolean,
        default: false,
    },
    rules: {
        type: Object,
        default: baseErrorJSON,
        validate: {validator: validateRules}
    },
    words: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Word',
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Story', storyModel);
