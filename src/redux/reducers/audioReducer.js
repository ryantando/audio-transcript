/* eslint-disable no-duplicate-case */

import {
    SET_AUDIO_SPEED, SET_FORWARD, SET_REWIND, CLEAR_FORWARD_REWIND
} from '../action/types';

const INITAL_STATE = {
    audioSpeed: 1,
    forward: false,
    rewind: false
};
  
export default (state = INITAL_STATE, action) => {
    switch (action.type) {
        case SET_AUDIO_SPEED:
            return { ...state, audioSpeed: action.payload }
        case SET_FORWARD:
            return { ...state, forward: true }
        case SET_REWIND:
            return { ...state, rewind: true }
        case CLEAR_FORWARD_REWIND:
            return { ...state, rewind: false, forward: false }
        default:
            return state;
    }
};