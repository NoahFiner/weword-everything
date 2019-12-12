import {LOGIN, LOGOUT} from "../constants";

const initialState = {
    loggedIn: false,
    name: '',
}

function rootReducer(state = initialState, action) {
    const newState = {}
    if(action.type === LOGIN) {
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