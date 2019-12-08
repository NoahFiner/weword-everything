import {LOGIN, LOGOUT} from "../constants";

const initialState = {
    loggedIn: false,
    name: '',
}

function rootReducer(state = initialState, action) {
    const newState = {}
    if(action.type === LOGIN) {
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