import {LOGIN, LOGOUT} from "../constants";

var Filter = require('bad-words'),
    filter = new Filter();

const initialState = {
    loggedIn: false,
    name: '',
};

function rootReducer(state = initialState, action) {
    const newState = {};
    if(action.type === LOGIN) {
        if(filter.isProfane(action.payload)) {
            throw new Error("Error in logging in, try another name");
        }
        // just a bunch of other bad names
        const badStrings = ["nig", "niig", "niiig", "niiiig", "niiiiig", "niiiiiig", "niiiiiiig", "niiiiiiiiig", "fcuk", "fuk", "fuck", "siht", "shit", "cunt", "cnut", "kkk"];
        const lowerCase = action.payload.toLowerCase();
        if(badStrings.some(str => lowerCase.includes(str))) {
            throw new Error("Error in logging in, try another name");
        }
        if(action.payload.length >= 16) {
            throw new Error("Name is too long");
        }
        state = {
            loggedIn: true,
            name: action.payload
        }
    }
    else if(action.type === LOGOUT) {
        state = initialState;
    }
    return state;
}

export default rootReducer;